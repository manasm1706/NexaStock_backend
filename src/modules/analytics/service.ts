import { AnalyticsRepository } from "./repository";
import type { AnalyticsDashboardDTO, TopProductDTO, ProductVelocityDTO, AlertDTO, ValueNameDTO, TrendPointDTO, CategoryMetricDTO, LowStockItemDTO, DeadStockItemDTO, DrillDownItemDTO } from "./dto";
import { toAlertDTO } from "./mapper";
import { prisma } from "../../lib/db";
import { resolveLocationScope } from "../../lib/locationScoper";

export class AnalyticsService {
  private readonly repository = new AnalyticsRepository();

  // Simple in-memory cache with TTL (10 seconds)
  private static cache = new Map<string, { data: AnalyticsDashboardDTO; timestamp: number }>();
  private static CACHE_TTL_MS = 10000; // 10 seconds

  /**
   * Clears the analytics cache for a specific tenant.
   * Called during checkouts/movements to ensure real-time accuracy.
   */
  static clearCache(tenantId: string): void {
    for (const key of AnalyticsService.cache.keys()) {
      if (key.startsWith(`${tenantId}:`)) {
        AnalyticsService.cache.delete(key);
      }
    }
  }

  async getDashboardData(
    tenantId: string,
    startDateStr?: string,
    endDateStr?: string,
    actorId?: string,
    roleCode?: string
  ): Promise<AnalyticsDashboardDTO> {
    let locationIds: string[] | undefined = undefined;
    let cacheKey = `${tenantId}:${startDateStr || ""}:${endDateStr || ""}`;

    if (actorId && roleCode) {
      const scope = await resolveLocationScope(actorId, tenantId, roleCode);
      if (scope.isRestricted) {
        locationIds = scope.locationIds;
        cacheKey = `${tenantId}:${actorId}:${startDateStr || ""}:${endDateStr || ""}`;
      }
    }

    const nowMs = Date.now();
    const cached = AnalyticsService.cache.get(cacheKey);

    if (cached && (nowMs - cached.timestamp < AnalyticsService.CACHE_TTL_MS)) {
      return cached.data;
    }

    // Define parsed dates
    let startDate: Date;
    let endDate: Date = endDateStr ? new Date(endDateStr) : new Date();

    if (startDateStr) {
      startDate = new Date(startDateStr);
    } else {
      // Default to last 365 days to ensure trends and annual statistics are available
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Fetch data in parallel
    const [products, alerts, sales, inventories, pendingTransfers, locations, categories] = await Promise.all([
      this.repository.getProducts(tenantId),
      this.repository.getAlerts(tenantId),
      this.repository.getCompletedSales(tenantId, startDate, endDate, locationIds),
      this.repository.getBalances(tenantId, locationIds),
      this.repository.getPendingTransfersCount(tenantId, locationIds),
      this.repository.getLocations(tenantId, locationIds),
      this.repository.getProductCategories(tenantId)
    ]);

    // Helpers
    const getProductPrices = (prod: any) => {
      const meta = (prod?.metadata as Record<string, any>) || {};
      const purchasePrice = Number(meta.purchasePrice ?? (prod?.sku === "MED-PARA-500" ? 35 : (prod?.sku === "APP-DENIM-SHIRT" ? 650 : 100)));
      const sellingPrice = Number(meta.sellingPrice ?? (prod?.sku === "MED-PARA-500" ? 48 : (prod?.sku === "APP-DENIM-SHIRT" ? 1099 : 150)));
      return { purchasePrice, sellingPrice };
    };

    // Region lookup helper
    const getRegionFromLocation = (loc: any) => {
      if (!loc) return "South";
      const name = (loc.name || "").toLowerCase();
      const city = (loc.city || "").toLowerCase();
      const state = (loc.state || "").toLowerCase();

      if (city.includes("bengaluru") || city.includes("bangalore") || city.includes("chennai") || city.includes("hyderabad") || state.includes("karnataka") || state.includes("tamil nadu") || state.includes("kerala")) {
        return "South";
      }
      if (city.includes("mumbai") || city.includes("pune") || city.includes("ahmedabad") || state.includes("maharashtra") || state.includes("gujarat") || state.includes("rajasthan")) {
        return "West";
      }
      if (city.includes("delhi") || city.includes("noida") || city.includes("gurgaon") || state.includes("haryana") || state.includes("punjab") || state.includes("uttar pradesh")) {
        return "North";
      }
      if (city.includes("kolkata") || city.includes("patna") || city.includes("guwahati") || state.includes("west bengal") || state.includes("bihar") || state.includes("assam")) {
        return "East";
      }

      if (name.includes("south")) return "South";
      if (name.includes("west")) return "West";
      if (name.includes("north")) return "North";
      if (name.includes("east")) return "East";

      return "South"; // Fallback to South
    };

    // Calculate timestamps for KPIs
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startOfYear = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    // Filtered sales
    const salesToday = sales.filter(s => new Date(s.saleDate) >= startOfToday);
    const salesWeek = sales.filter(s => new Date(s.saleDate) >= startOfWeek);
    const salesMonth = sales.filter(s => new Date(s.saleDate) >= startOfMonth);
    const salesYear = sales.filter(s => new Date(s.saleDate) >= startOfYear);

    // Task 1: Dashboard KPI Calculations
    const revenueToday = salesToday.reduce((sum, s) => sum + Number(s.grandTotal), 0);
    const revenueWeek = salesWeek.reduce((sum, s) => sum + Number(s.grandTotal), 0);
    const revenueMonth = salesMonth.reduce((sum, s) => sum + Number(s.grandTotal), 0);
    const revenueYear = salesYear.reduce((sum, s) => sum + Number(s.grandTotal), 0);

    const totalOrdersMonth = salesMonth.length;
    const avgOrderValueMonth = totalOrdersMonth > 0 ? revenueMonth / totalOrdersMonth : 0;
    const unitsSoldMonth = salesMonth.reduce((sum, s) => {
      const items = (s as any).items || [];
      return sum + items.reduce((iSum: number, item: any) => iSum + item.quantity, 0);
    }, 0);

    // Inventory Valuation
    let inventoryValue = 0;
    for (const inv of inventories) {
      const prod = products.find(p => p.id === inv.productId);
      const { purchasePrice } = getProductPrices(prod);
      inventoryValue += purchasePrice * inv.qtyOnHand;
    }

    // Low stock counts (based on location balances)
    let lowStockItemsCount = 0;
    let outOfStockItemsCount = 0;
    for (const prod of products) {
      const invs = inventories.filter(i => i.productId === prod.id);
      const totalStock = invs.reduce((sum, i) => sum + i.qtyOnHand, 0);
      if (totalStock === 0) {
        outOfStockItemsCount += 1;
      }
      if (totalStock <= prod.reorderLevel) {
        lowStockItemsCount += 1;
      }
    }

    // Location counts
    const activeStores = locations.filter(l => l.locationType === "STORE" && l.status === "ACTIVE").length;
    const activeWarehouses = locations.filter(l => l.locationType === "WAREHOUSE" && l.status === "ACTIVE").length;

    // Task 2: Revenue Trend calculations (Daily, Weekly, Monthly)
    // Daily revenue (last 30 days)
    const dailyTrendMap = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      dailyTrendMap.set(dateStr, 0);
    }
    for (const sale of salesMonth) {
      const dateStr = new Date(sale.saleDate).toISOString().slice(0, 10);
      if (dailyTrendMap.has(dateStr)) {
        dailyTrendMap.set(dateStr, (dailyTrendMap.get(dateStr) || 0) + Number(sale.grandTotal));
      }
    }
    const dailyTrends: TrendPointDTO[] = Array.from(dailyTrendMap.entries()).map(([date, value]) => ({ date, value }));

    // Weekly revenue (last 12 weeks)
    const weeklyTrends: TrendPointDTO[] = [];
    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const end = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const label = `${start.toLocaleString("default", { month: "short" })} ${start.getDate()}`;
      
      const val = sales.reduce((sum, s) => {
        const d = new Date(s.saleDate);
        if (d >= start && d < end) {
          return sum + Number(s.grandTotal);
        }
        return sum;
      }, 0);
      weeklyTrends.push({ date: label, value: val });
    }

    // Monthly revenue (last 12 months)
    const monthlyTrends: TrendPointDTO[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
      const year = d.getFullYear();
      const month = d.getMonth();
      
      const val = sales.reduce((sum, s) => {
        const sd = new Date(s.saleDate);
        if (sd.getFullYear() === year && sd.getMonth() === month) {
          return sum + Number(s.grandTotal);
        }
        return sum;
      }, 0);
      monthlyTrends.push({ date: label, value: val });
    }

    // Revenue by Store
    const storePerfMap = new Map<string, number>();
    for (const loc of locations) {
      if (loc.locationType === "STORE") {
        storePerfMap.set(loc.id, 0);
      }
    }
    for (const sale of sales) {
      if (storePerfMap.has(sale.locationId)) {
        storePerfMap.set(sale.locationId, (storePerfMap.get(sale.locationId) || 0) + Number(sale.grandTotal));
      }
    }
    const storePerformance: ValueNameDTO[] = Array.from(storePerfMap.entries()).map(([locId, value]) => {
      const loc = locations.find(l => l.id === locId);
      return { name: loc?.name || "Unknown Store", value };
    }).sort((a, b) => b.value - a.value);

    // Warehouse Contribution (Valuation by Warehouse)
    const whContrMap = new Map<string, number>();
    for (const loc of locations) {
      if (loc.locationType === "WAREHOUSE") {
        whContrMap.set(loc.id, 0);
      }
    }
    for (const inv of inventories) {
      if (whContrMap.has(inv.locationId)) {
        const prod = products.find(p => p.id === inv.productId);
        const { purchasePrice } = getProductPrices(prod);
        whContrMap.set(inv.locationId, (whContrMap.get(inv.locationId) || 0) + purchasePrice * inv.qtyOnHand);
      }
    }
    const warehouseContribution: ValueNameDTO[] = Array.from(whContrMap.entries()).map(([locId, value]) => {
      const loc = locations.find(l => l.id === locId);
      return { name: loc?.name || "Unknown Warehouse", value };
    }).sort((a, b) => b.value - a.value);

    // Task 3: Product Analytics (Grouped by Product ID)
    const productStatsMap = new Map<string, { units: number; revenue: number }>();
    for (const prod of products) {
      productStatsMap.set(prod.id, { units: 0, revenue: 0 });
    }
    for (const sale of sales) {
      const items = (sale as any).items || [];
      for (const item of items) {
        const current = productStatsMap.get(item.productId) || { units: 0, revenue: 0 };
        current.units += item.quantity;
        current.revenue += Number(item.lineTotal);
        productStatsMap.set(item.productId, current);
      }
    }

    const mappedProductsStats = Array.from(productStatsMap.entries()).map(([productId, stats]) => {
      const prod = products.find(p => p.id === productId);
      return {
        productId,
        name: prod?.name || "Unknown Product",
        sku: prod?.sku || "UNKNOWN",
        units: stats.units,
        revenue: stats.revenue
      };
    });

    const topSellingByQty = [...mappedProductsStats].sort((a, b) => b.units - a.units).slice(0, 5);
    const topSellingByRev = [...mappedProductsStats].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    // Worst performing: filter out items with 0 sales if possible or include them
    const worstPerformingByQty = [...mappedProductsStats].sort((a, b) => a.units - b.units).slice(0, 5);
    const worstPerformingByRev = [...mappedProductsStats].sort((a, b) => a.revenue - b.revenue).slice(0, 5);

    // Velocity based on last 30 days
    const fastMoving: ProductVelocityDTO[] = [];
    const slowMoving: ProductVelocityDTO[] = [];
    const velocityList = products.map(prod => {
      const stats = productStatsMap.get(prod.id) || { units: 0, revenue: 0 };
      const invs = inventories.filter(i => i.productId === prod.id);
      const qtyOnHand = invs.reduce((sum, i) => sum + i.qtyOnHand, 0);
      const velocity = stats.units / 30.0;
      return {
        productId: prod.id,
        name: prod.name,
        sku: prod.sku,
        unitsSold: stats.units,
        qtyOnHand,
        velocity
      };
    });

    const sortedVelocity = [...velocityList].sort((a, b) => b.velocity - a.velocity);
    fastMoving.push(...sortedVelocity.slice(0, 5));

    // Slow moving includes products in stock (qtyOnHand > 0) with low velocity
    const sortedSlow = [...velocityList]
      .filter(item => item.qtyOnHand > 0)
      .sort((a, b) => a.velocity - b.velocity);
    slowMoving.push(...sortedSlow.slice(0, 5));

    // Task 4: Category Analytics
    const categoryMetricsMap = new Map<string, { revenue: number; unitsSold: number; val: number }>();
    for (const cat of categories) {
      categoryMetricsMap.set(cat.id, { revenue: 0, unitsSold: 0, val: 0 });
    }
    // Calculate revenues and units from sales
    for (const sale of salesMonth) {
      const items = (sale as any).items || [];
      for (const item of items) {
        const catId = item.product?.categoryId;
        if (catId && categoryMetricsMap.has(catId)) {
          const current = categoryMetricsMap.get(catId)!;
          current.revenue += Number(item.lineTotal);
          current.unitsSold += item.quantity;
          categoryMetricsMap.set(catId, current);
        }
      }
    }
    // Calculate valuation
    for (const inv of inventories) {
      const catId = inv.product?.categoryId;
      if (catId && categoryMetricsMap.has(catId)) {
        const { purchasePrice } = getProductPrices(inv.product);
        const current = categoryMetricsMap.get(catId)!;
        current.val += purchasePrice * inv.qtyOnHand;
        categoryMetricsMap.set(catId, current);
      }
    }
    const categoryAnalytics: CategoryMetricDTO[] = Array.from(categoryMetricsMap.entries()).map(([catId, metrics]) => {
      const cat = categories.find(c => c.id === catId);
      return {
        name: cat?.name || "Uncategorized",
        revenue: metrics.revenue,
        unitsSold: metrics.unitsSold,
        inventoryValue: metrics.val
      };
    });

    // Task 5: Inventory Analytics
    // Low Stock dashboard items
    const lowStockItems: LowStockItemDTO[] = [];
    for (const inv of inventories) {
      const prod = products.find(p => p.id === inv.productId);
      const reorderLvl = inv.reorderLevel || prod?.reorderLevel || 0;
      if (inv.qtyOnHand <= reorderLvl && prod) {
        lowStockItems.push({
          productId: prod.id,
          name: prod.name,
          sku: prod.sku,
          qtyOnHand: inv.qtyOnHand,
          reorderLevel: reorderLvl,
          locationName: inv.location?.name || "Unknown Location"
        });
      }
    }

    // Dead Stock: qtyOnHand > 0 but 0 sales in last 30 days
    const deadStockItems: DeadStockItemDTO[] = [];
    for (const inv of inventories) {
      if (inv.qtyOnHand > 0) {
        const stats = productStatsMap.get(inv.productId);
        if (!stats || stats.units === 0) {
          const prod = products.find(p => p.id === inv.productId);
          if (prod) {
            deadStockItems.push({
              productId: prod.id,
              name: prod.name,
              sku: prod.sku,
              qtyOnHand: inv.qtyOnHand,
              locationName: inv.location?.name || "Unknown Location"
            });
          }
        }
      }
    }

    // Stock Turnover
    let totalCostOfGoodsSold = 0;
    for (const sale of salesMonth) {
      const items = (sale as any).items || [];
      for (const item of items) {
        const { purchasePrice } = getProductPrices(item.product);
        totalCostOfGoodsSold += purchasePrice * item.quantity;
      }
    }
    const turnoverRatio = inventoryValue > 0 ? totalCostOfGoodsSold / inventoryValue : 0;

    // Task 6: Regional Analytics
    const cityMap = new Map<string, number>();
    const regionMap = new Map<string, number>([
      ["South", 0],
      ["West", 0],
      ["North", 0],
      ["East", 0]
    ]);

    for (const sale of sales) {
      const loc = sale.location;
      const city = loc?.city || "Unknown City";
      cityMap.set(city, (cityMap.get(city) || 0) + Number(sale.grandTotal));

      const region = getRegionFromLocation(loc);
      regionMap.set(region, (regionMap.get(region) || 0) + Number(sale.grandTotal));
    }

    const revenueByCity: ValueNameDTO[] = Array.from(cityMap.entries()).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
    const revenueByStore = storePerformance;
    const revenueByRegion: ValueNameDTO[] = Array.from(regionMap.entries()).map(([name, value]) => ({ name, value }));

    // Task 5: Drill-down support (by Store and Category)
    const byStore: DrillDownItemDTO[] = locations.filter(l => l.locationType === "STORE").map(loc => {
      const storeSales = sales.filter(s => s.locationId === loc.id);
      const prodMap = new Map<string, { units: number; revenue: number }>();
      
      let storeRev = 0;
      for (const sale of storeSales) {
        storeRev += Number(sale.grandTotal);
        const items = (sale as any).items || [];
        for (const item of items) {
          const current = prodMap.get(item.productId) || { units: 0, revenue: 0 };
          current.units += item.quantity;
          current.revenue += Number(item.lineTotal);
          prodMap.set(item.productId, current);
        }
      }

      const productsSold = Array.from(prodMap.entries()).map(([productId, stats]) => {
        const prod = products.find(p => p.id === productId);
        return {
          productId,
          name: prod?.name || "Unknown Product",
          sku: prod?.sku || "UNKNOWN",
          units: stats.units,
          revenue: stats.revenue
        };
      }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

      return {
        id: loc.id,
        name: loc.name,
        revenue: storeRev,
        productsSold
      };
    });

    const byCategory: DrillDownItemDTO[] = categories.map(cat => {
      const prodMap = new Map<string, { units: number; revenue: number }>();
      let catRev = 0;

      for (const sale of salesMonth) {
        const items = (sale as any).items || [];
        for (const item of items) {
          if (item.product?.categoryId === cat.id) {
            catRev += Number(item.lineTotal);
            const current = prodMap.get(item.productId) || { units: 0, revenue: 0 };
            current.units += item.quantity;
            current.revenue += Number(item.lineTotal);
            prodMap.set(item.productId, current);
          }
        }
      }

      const productsSold = Array.from(prodMap.entries()).map(([productId, stats]) => {
        const prod = products.find(p => p.id === productId);
        return {
          productId,
          name: prod?.name || "Unknown Product",
          sku: prod?.sku || "UNKNOWN",
          units: stats.units,
          revenue: stats.revenue
        };
      }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

      return {
        id: cat.id,
        name: cat.name,
        revenue: catRev,
        productsSold
      };
    });

    // Map topProducts for compatibility with the legacy KPI card
    const topProductsMapped = topSellingByRev.map(p => ({
      productId: p.productId,
      name: p.name,
      sku: p.sku,
      units: p.units,
      revenue: p.revenue
    }));


    const result: AnalyticsDashboardDTO = {
      revenue: revenueMonth, // fallback to Monthly MTD revenue
      grossMargin: revenueMonth - totalCostOfGoodsSold,
      inventoryValue,
      lowStockAlerts: lowStockItemsCount,
      pendingTransfers,
      locations: activeStores,
      topProducts: topProductsMapped,
      alerts: alerts.map(toAlertDTO),


      revenueMetrics: {
        today: revenueToday,
        week: revenueWeek,
        month: revenueMonth,
        year: revenueYear
      },
      salesMetrics: {
        totalOrders: totalOrdersMonth,
        averageOrderValue: avgOrderValueMonth,
        unitsSold: unitsSoldMonth
      },
      inventoryMetrics: {
        inventoryValue,
        lowStockItems: lowStockItemsCount,
        outOfStockItems: outOfStockItemsCount
      },
      storeMetrics: {
        activeStores,
        activeWarehouses
      },
      revenueTrends: {
        daily: dailyTrends,
        weekly: weeklyTrends,
        monthly: monthlyTrends
      },
      storePerformance,
      warehouseContribution,
      productPerformance: {
        topSellingByQty: topSellingByQty.map(p => ({ productId: p.productId, name: p.name, sku: p.sku, units: p.units, revenue: p.revenue })),
        topSellingByRev: topSellingByRev.map(p => ({ productId: p.productId, name: p.name, sku: p.sku, units: p.units, revenue: p.revenue })),
        worstPerformingByQty: worstPerformingByQty.map(p => ({ productId: p.productId, name: p.name, sku: p.sku, units: p.units, revenue: p.revenue })),
        worstPerformingByRev: worstPerformingByRev.map(p => ({ productId: p.productId, name: p.name, sku: p.sku, units: p.units, revenue: p.revenue })),
        fastMoving,
        slowMoving
      },
      categoryAnalytics,
      inventoryAnalytics: {
        lowStock: lowStockItems,
        deadStock: deadStockItems,
        turnover: {
          cogs: totalCostOfGoodsSold,
          avgInventoryValue: inventoryValue,
          ratio: turnoverRatio
        },
        value: inventoryValue
      },
      regionalAnalytics: {
        revenueByCity,
        revenueByStore,
        revenueByRegion
      },
      drillDown: {
        byStore,
        byCategory
      }
    };

    // Store in cache
    AnalyticsService.cache.set(cacheKey, { data: result, timestamp: nowMs });

    return result;
  }

  async generateCSVReport(reportType: string, tenantId: string): Promise<string> {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    const tenantName = tenant?.name || "Acme Retail Group";
    const timestamp = new Date().toISOString();

    const getProductPrices = (prod: any) => {
      const meta = (prod?.metadata as Record<string, any>) || {};
      const purchasePrice = Number(meta.purchasePrice ?? (prod?.sku === "MED-PARA-500" ? 35 : (prod?.sku === "APP-DENIM-SHIRT" ? 650 : 100)));
      const sellingPrice = Number(meta.sellingPrice ?? (prod?.sku === "MED-PARA-500" ? 48 : (prod?.sku === "APP-DENIM-SHIRT" ? 1099 : 150)));
      return { purchasePrice, sellingPrice };
    };

    // Audit header prefix
    let csv = `# Report Type: ${reportType.toUpperCase()} REPORT\n`;
    csv += `# Tenant Name: ${tenantName}\n`;
    csv += `# Generated At: ${timestamp}\n`;
    csv += `# File Format: CSV (Spreadsheet Compatible)\n\n`;

    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return "";
      const str = String(val).replace(/"/g, '""');
      if (str.includes(",") || str.includes("\n") || str.includes('"')) {
        return `"${str}"`;
      }
      return str;
    };

    if (reportType === "revenue") {
      // Date range: all time for completed sales
      const sales = await this.repository.getCompletedSales(tenantId);
      
      csv += "Date,Invoice Number,Store Name,Customer Name,Customer Phone,Subtotal,Discount,Tax,Grand Total,Payment Method\n";
      for (const sale of sales) {
        const meta = (sale.metadata as Record<string, any>) || {};
        const custName = meta.customerName || "Walk-in Customer";
        const custPhone = meta.customerPhone || "N/A";
        const payMode = meta.paymentMode || (sale.payments?.[0]?.method) || "CASH";
        
        csv += [
          escapeCSV(sale.saleDate.toISOString().slice(0, 10)),
          escapeCSV(sale.saleNumber),
          escapeCSV(sale.location?.name || "Unknown Store"),
          escapeCSV(custName),
          escapeCSV(custPhone),
          sale.subtotal.toString(),
          sale.discountTotal.toString(),
          sale.taxTotal.toString(),
          sale.grandTotal.toString(),
          escapeCSV(payMode)
        ].join(",") + "\n";
      }
    } else if (reportType === "products") {
      const [products, sales] = await Promise.all([
        this.repository.getProducts(tenantId),
        this.repository.getCompletedSales(tenantId)
      ]);

      const stats = new Map<string, { qty: number; rev: number }>();
      for (const sale of sales) {
        const items = (sale as any).items || [];
        for (const item of items) {
          const current = stats.get(item.productId) || { qty: 0, rev: 0 };
          current.qty += item.quantity;
          current.rev += Number(item.lineTotal);
          stats.set(item.productId, current);
        }
      }

      csv += "SKU,Product Name,Category,Brand,Units Sold,Total Revenue,Purchase Price,Selling Price\n";
      for (const prod of products) {
        const productStats = stats.get(prod.id) || { qty: 0, rev: 0 };
        const { purchasePrice, sellingPrice } = getProductPrices(prod);
        csv += [
          escapeCSV(prod.sku),
          escapeCSV(prod.name),
          escapeCSV(prod.category?.name || "Uncategorized"),
          escapeCSV(prod.brand || "N/A"),
          productStats.qty.toString(),
          productStats.rev.toString(),
          purchasePrice.toString(),
          sellingPrice.toString()
        ].join(",") + "\n";
      }
    } else if (reportType === "inventory") {
      const [balances, products] = await Promise.all([
        this.repository.getBalances(tenantId),
        this.repository.getProducts(tenantId)
      ]);

      csv += "SKU,Product Name,Category,Location Name,Location Type,Quantity On Hand,Purchase Price,Total Valuation,Reorder Level\n";
      for (const bal of balances) {
        const prod = products.find(p => p.id === bal.productId);
        const { purchasePrice } = getProductPrices(prod);
        csv += [
          escapeCSV(bal.product?.sku || "UNKNOWN"),
          escapeCSV(bal.product?.name || "Unknown Product"),
          escapeCSV(bal.product?.category?.name || "Uncategorized"),
          escapeCSV(bal.location?.name || "Unknown Location"),
          escapeCSV(bal.location?.locationType || "STORE"),
          bal.qtyOnHand.toString(),
          purchasePrice.toString(),
          (bal.qtyOnHand * purchasePrice).toString(),
          (bal.reorderLevel || prod?.reorderLevel || 0).toString()
        ].join(",") + "\n";
      }
    } else {
      csv += "Error: Unknown report type requested.\n";
    }

    return csv;
  }
}
