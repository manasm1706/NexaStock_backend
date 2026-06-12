import { TransfersRepository } from "./repository";
import { toTransferDTO } from "./mapper";
import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";
import type { CreateTransferInput } from "./schema";

export class TransfersService {
  private readonly repository = new TransfersRepository();

  async getTransfersList(tenantId: string) {
    const transfers = await this.repository.findTransfers(tenantId);
    return transfers.map(toTransferDTO);
  }

  async createTransferRequest(input: CreateTransferInput, actorId: string, tenantId: string) {
    const { fromLocationId, toLocationId, items } = input;

    const result = await prisma.$transaction(async () => {
      const transfer = await this.repository.createTransfer({
        tenantId,
        fromLocationId,
        toLocationId,
        requestedByUserId: actorId
      });

      let lineNum = 1;
      for (const item of items) {
        await this.repository.createTransferItem({
          tenantId,
          transferRequestId: transfer.id,
          productId: item.productId,
          lineNumber: lineNum++,
          requestedQty: item.requestedQuantity
        });
      }

      return transfer;
    });

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId: actorId,
        module: "transfers",
        action: "create",
        summary: `Created transfer request ${result.id} from ${fromLocationId} to ${toLocationId}`,
        entityType: "transfer",
        severity: "INFO"
      }
    });

    // Fetch fresh details with items
    const freshTransfer = await prisma.transferRequest.findUnique({
      where: { id: result.id },
      include: { items: true }
    });

    return toTransferDTO(freshTransfer);
  }
}
