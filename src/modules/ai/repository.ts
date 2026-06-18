import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";

export class AIRepository {
  async getProducts(tenantId: string) {
    return prisma.product.findMany({
      where: { tenantId },
      include: { category: true }
    });
  }

  async getBalances(tenantId: string) {
    return prisma.inventory.findMany({
      where: { tenantId },
      include: { product: true, location: true }
    });
  }

  async getCompletedSales(tenantId: string, startDate?: Date) {
    const whereClause: any = { tenantId, status: "COMPLETED" };
    if (startDate) {
      whereClause.saleDate = { gte: startDate };
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
        location: true
      },
      orderBy: { saleDate: "desc" }
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

  // AI Center snapshot history persistence
  async getTodaySnapshot(tenantId: string) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    return prisma.dashboardSnapshot.findFirst({
      where: {
        tenantId,
        snapshotType: "AI_CENTER",
        snapshotDate: {
          gte: startOfToday
        }
      }
    });
  }

  async saveSnapshot(tenantId: string, metrics: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Delete existing snapshot for today to prevent duplicates
    await prisma.dashboardSnapshot.deleteMany({
      where: {
        tenantId,
        snapshotType: "AI_CENTER",
        snapshotDate: today
      }
    });

    return prisma.dashboardSnapshot.create({
      data: {
        id: createId("dbs"),
        tenantId,
        snapshotDate: today,
        snapshotType: "AI_CENTER",
        metrics: metrics || null
      }
    });
  }

  async getStoredRecommendations(tenantId: string) {
    return prisma.aIRecommendation.findMany({
      where: { tenantId, status: "OPEN" },
      orderBy: { createdAt: "desc" }
    });
  }

  async saveRecommendations(tenantId: string, recs: any[]) {
    // Delete existing open recommendations to refresh
    await prisma.aIRecommendation.deleteMany({
      where: { tenantId, status: "OPEN" }
    });

    for (const rec of recs) {
      await prisma.aIRecommendation.create({
        data: {
          id: createId("airec"),
          tenantId,
          recommendationType: rec.tag,
          priority: rec.priority,
          entityType: rec.entityType || "product",
          entityId: rec.entityId || "none",
          title: rec.title,
          description: rec.body,
          confidence: rec.confidence,
          status: "OPEN",
          metadata: rec.metadata || null
        }
      });
    }
  }
}
