import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";

export class TransfersRepository {
  async findTransfers(tenantId: string, locationIds?: string[]) {
    const where: any = { tenantId };
    if (locationIds) {
      where.OR = [
        { fromLocationId: { in: locationIds } },
        { toLocationId: { in: locationIds } }
      ];
    }
    return prisma.transferRequest.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" }
    });
  }

  async createTransfer(data: {
    tenantId: string;
    fromLocationId: string;
    toLocationId: string;
    requestedByUserId: string;
    metadata?: any;
  }) {
    return prisma.transferRequest.create({
      data: {
        id: createId("trf"),
        tenantId: data.tenantId,
        requestNumber: createId("REQ"),
        fromLocationId: data.fromLocationId,
        toLocationId: data.toLocationId,
        status: "REQUESTED",
        requestedByUserId: data.requestedByUserId,
        metadata: data.metadata || null
      }
    });
  }

  async createTransferItem(data: {
    tenantId: string;
    transferRequestId: string;
    productId: string;
    lineNumber: number;
    requestedQty: number;
  }) {
    return prisma.transferRequestItem.create({
      data: {
        id: createId("trfi"),
        tenantId: data.tenantId,
        transferRequestId: data.transferRequestId,
        productId: data.productId,
        lineNumber: data.lineNumber,
        requestedQty: data.requestedQty,
        approvedQty: 0
      }
    });
  }
}
