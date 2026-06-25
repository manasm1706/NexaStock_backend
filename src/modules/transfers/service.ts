import { TransfersRepository } from "./repository";
import { toTransferDTO } from "./mapper";
import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";
import { resolveLocationScope, buildAuditMetadata } from "../../lib/locationScoper";
import { ForbiddenError } from "../../lib/errors";
import type { CreateTransferInput } from "./schema";

export class TransfersService {
  private readonly repository = new TransfersRepository();

  async getTransfersList(tenantId: string, actorId?: string, roleCode?: string) {
    let locationIds: string[] | undefined = undefined;
    if (actorId && roleCode) {
      const scope = await resolveLocationScope(actorId, tenantId, roleCode);
      if (scope.isRestricted) {
        locationIds = scope.locationIds;
      }
    }
    const transfers = await this.repository.findTransfers(tenantId, locationIds);
    return transfers.map(toTransferDTO);
  }

  async createTransferRequest(input: CreateTransferInput, actorId: string, roleCode: string, tenantId: string) {
    const { fromLocationId, toLocationId, items } = input;

    // Check location scoping for source location
    const scope = await resolveLocationScope(actorId, tenantId, roleCode);
    if (scope.isRestricted && !scope.locationIds.includes(fromLocationId)) {
      throw new ForbiddenError("You do not have permission to initiate transfer from this location");
    }

    const auditMeta = buildAuditMetadata(actorId, roleCode, fromLocationId);

    const result = await prisma.$transaction(async () => {
      const transfer = await this.repository.createTransfer({
        tenantId,
        fromLocationId,
        toLocationId,
        requestedByUserId: actorId,
        metadata: auditMeta
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
        severity: "INFO",
        afterData: auditMeta
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
