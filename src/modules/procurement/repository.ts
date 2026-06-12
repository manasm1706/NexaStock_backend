import { prisma } from "../../lib/db";

export class ProcurementRepository {
  async findSuppliers(tenantId: string) {
    return prisma.supplier.findMany({
      where: { tenantId },
      include: { contacts: true }
    });
  }
}
