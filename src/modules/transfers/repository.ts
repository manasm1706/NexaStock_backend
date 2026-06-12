import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";

export class TransfersRepository {
  async findTransfers(tenantId: string) {
    return prisma.transferRequest.findMany({
      where: { tenantId },
      include: { items: true },
      orderBy: { createdAt: "desc" }
    });
  }

  async createTransfer(data: {
    tenantId: string;
    fromLocationId: string;
    toLocationId: string;
    requestedByUserId: string;
  }) {
    return prisma.transferRequest.create({
      data: {
        id: createId("trf"),
        tenantId: data.tenantId,
        requestNumber: createId("REQ"),
        fromLocationId: data.fromLocationId,
        toLocationId: data.toLocationId,
        status: "REQUESTED",
        requestedByUserId: data.requestedByUserId
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
