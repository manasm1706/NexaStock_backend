export interface TopProductDTO {
  productId: string;
  name: string;
  sku: string;
  units: number;
  revenue: number;
}

export interface ProductVelocityDTO {
  productId: string;
  name: string;
  sku: string;
  unitsSold: number;
  qtyOnHand: number;
  velocity: number; // units sold per day
}

export interface AlertDTO {
  id: string;
  tenantId: string;
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  resolved: boolean;
  createdAt: string;
}

export interface ValueNameDTO {
  name: string;
  value: number;
}

export interface TrendPointDTO {
  date: string;
  value: number;
}

export interface CategoryMetricDTO {
  name: string;
  revenue: number;
  unitsSold: number;
  inventoryValue: number;
}

export interface LowStockItemDTO {
  productId: string;
  name: string;
  sku: string;
  qtyOnHand: number;
  reorderLevel: number;
  locationName: string;
}

export interface DeadStockItemDTO {
  productId: string;
  name: string;
  sku: string;
  qtyOnHand: number;
  locationName: string;
}

export interface DrillDownItemDTO {
  id: string;
  name: string;
  revenue: number;
  productsSold: { productId: string; name: string; sku: string; units: number; revenue: number }[];
}

export interface AnalyticsDashboardDTO {
  // Existing fields
  revenue: number;
  grossMargin: number;
  inventoryValue: number;
  lowStockAlerts: number;
  pendingTransfers: number;
  locations?: number;
  topProducts: TopProductDTO[];
  alerts: AlertDTO[];


  // Task 1: Dashboard KPI Accuracy
  revenueMetrics: {
    today: number;
    week: number;
    month: number;
    year: number;
  };
  salesMetrics: {
    totalOrders: number;
    averageOrderValue: number;
    unitsSold: number;
  };
  inventoryMetrics: {
    inventoryValue: number;
    lowStockItems: number;
    outOfStockItems: number;
  };
  storeMetrics: {
    activeStores: number;
    activeWarehouses: number;
  };

  // Task 2: Revenue Analytics Trends
  revenueTrends: {
    daily: TrendPointDTO[];
    weekly: TrendPointDTO[];
    monthly: TrendPointDTO[];
  };
  storePerformance: ValueNameDTO[];
  warehouseContribution: ValueNameDTO[];

  // Task 3: Product Analytics
  productPerformance: {
    topSellingByQty: TopProductDTO[];
    topSellingByRev: TopProductDTO[];
    worstPerformingByQty: TopProductDTO[];
    worstPerformingByRev: TopProductDTO[];
    fastMoving: ProductVelocityDTO[];
    slowMoving: ProductVelocityDTO[];
  };

  // Task 4: Category Analytics
  categoryAnalytics: CategoryMetricDTO[];

  // Task 5: Inventory Analytics
  inventoryAnalytics: {
    lowStock: LowStockItemDTO[];
    deadStock: DeadStockItemDTO[];
    turnover: {
      cogs: number;
      avgInventoryValue: number;
      ratio: number;
    };
    value: number;
  };

  // Task 6: Regional Analytics
  regionalAnalytics: {
    revenueByCity: ValueNameDTO[];
    revenueByStore: ValueNameDTO[];
    revenueByRegion: ValueNameDTO[];
  };

  // Task 5: Drill-down support
  drillDown: {
    byStore: DrillDownItemDTO[];
    byCategory: DrillDownItemDTO[];
  };
}
