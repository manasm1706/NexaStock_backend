import { prisma } from "../../lib/db";

export class ComplianceRepository {
  async getAuditLogs(tenantId: string) {
    return prisma.auditLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" }
    });
  }
}
