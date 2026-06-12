import { prisma } from "../../lib/db";

export class AIRepository {
  async getForecastRecords(tenantId: string) {
    return prisma.forecastRecord.findMany({
      where: { tenantId }
    });
  }

  async getRecommendations(tenantId: string) {
    return prisma.aIRecommendation.findMany({
      where: { tenantId }
    });
  }
}
