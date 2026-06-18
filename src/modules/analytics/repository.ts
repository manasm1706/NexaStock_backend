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

  async getCompletedSales(tenantId: string, startDate?: Date, endDate?: Date) {
    const whereClause: any = { tenantId, status: "COMPLETED" };
    if (startDate || endDate) {
      whereClause.saleDate = {};
      if (startDate) whereClause.saleDate.gte = startDate;
      if (endDate) whereClause.saleDate.lte = endDate;
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

  async getBalances(tenantId: string) {
    return prisma.inventory.findMany({
      where: { tenantId },
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

  async getPendingTransfersCount(tenantId: string) {
    return prisma.transferRequest.count({
      where: { tenantId, status: "REQUESTED" }
    });
  }

  async getLocations(tenantId: string) {
    return prisma.location.findMany({
      where: { tenantId }
    });
  }

  async getProductCategories(tenantId: string) {
    return prisma.productCategory.findMany({
      where: { tenantId }
    });
  }
}

