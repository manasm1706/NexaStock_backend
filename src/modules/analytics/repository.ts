import { prisma } from "../../lib/db";

export class AnalyticsRepository {
  async getProducts(tenantId: string) {
    return prisma.product.findMany({ where: { tenantId } });
  }

  async getAlerts(tenantId: string) {
    return prisma.alert.findMany({ where: { tenantId } });
  }

  async getCompletedSales(tenantId: string) {
    return prisma.sale.findMany({
      where: { tenantId, status: "COMPLETED" },
      include: { items: true }
    });
  }

  async getBalances(tenantId: string) {
    return prisma.inventory.findMany({
      where: { tenantId }
    });
  }

  async getPendingTransfersCount(tenantId: string) {
    return prisma.transferRequest.count({
      where: { tenantId, status: "REQUESTED" }
    });
  }
}
