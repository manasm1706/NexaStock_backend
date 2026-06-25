import { prisma } from "../../lib/db";

export class AnalyticsRepository {
  async getProducts(tenantId: string) {
    return prisma.product.findMany({ 
      where: { tenantId },
      include: { category: true }
    });
  }

  async getAlerts(tenantId: string) {
    return prisma.alert.findMany({ where: { tenantId } });
  }

  async getCompletedSales(tenantId: string, startDate?: Date, endDate?: Date, locationIds?: string[]) {
    const whereClause: any = { tenantId, status: "COMPLETED" };
    if (startDate || endDate) {
      whereClause.saleDate = {};
      if (startDate) whereClause.saleDate.gte = startDate;
      if (endDate) whereClause.saleDate.lte = endDate;
    }
    if (locationIds) {
      whereClause.locationId = { in: locationIds };
    }
    return prisma.sale.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        },
        location: true,
        payments: true
      },
      orderBy: { saleDate: "desc" }
    });
  }

  async getBalances(tenantId: string, locationIds?: string[]) {
    const whereClause: any = { tenantId };
    if (locationIds) {
      whereClause.locationId = { in: locationIds };
    }
    return prisma.inventory.findMany({
      where: whereClause,
      include: {
        product: {
          include: {
            category: true
          }
        },
        location: true
      }
    });
  }

  async getPendingTransfersCount(tenantId: string, locationIds?: string[]) {
    const whereClause: any = { tenantId, status: "REQUESTED" };
    if (locationIds) {
      whereClause.OR = [
        { fromLocationId: { in: locationIds } },
        { toLocationId: { in: locationIds } }
      ];
    }
    return prisma.transferRequest.count({
      where: whereClause
    });
  }

  async getLocations(tenantId: string, locationIds?: string[]) {
    const whereClause: any = { tenantId };
    if (locationIds) {
      whereClause.id = { in: locationIds };
    }
    return prisma.location.findMany({
      where: whereClause
    });
  }

  async getProductCategories(tenantId: string) {
    return prisma.productCategory.findMany({
      where: { tenantId }
    });
  }
}
