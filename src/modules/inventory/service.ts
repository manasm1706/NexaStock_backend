import { InventoryRepository } from "./repository";
import { toInventoryBalanceDTO, toInventoryMovementDTO } from "./mapper";
import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";
import type { AdjustInventoryInput } from "./schema";

export class InventoryService {
  private readonly repository = new InventoryRepository();

  async getBalances(tenantId: string) {
    const balances = await this.repository.findBalances(tenantId);
    return balances.map(toInventoryBalanceDTO);
  }

  async getMovements(tenantId: string) {
    const movements = await this.repository.findMovements(tenantId);
    return movements.map(toInventoryMovementDTO);
  }

  async adjustInventory(input: AdjustInventoryInput, actorId: string, tenantId: string) {
    const { productId, locationId, quantity, reason } = input;

    const result = await prisma.$transaction(async () => {
      let inv = await this.repository.findInventoryRecord(productId, locationId, tenantId);
      let qtyBefore = 0;

      if (!inv) {
        inv = await this.repository.createInventoryRecord(productId, locationId, quantity, tenantId);
      } else {
        qtyBefore = inv.qtyOnHand;
        inv = await this.repository.updateInventoryRecordQty(inv.id, quantity);
      }

      const movement = await this.repository.insertMovement(productId, locationId, quantity, reason, tenantId);
      await this.repository.insertStockAdjustment(inv.id, qtyBefore, inv.qtyOnHand, quantity, reason, tenantId);

      return movement;
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId: actorId,
        module: "inventory",
        action: "adjustment",
        summary: `Adjusted stock by ${quantity} units for product ${productId} at location ${locationId}. Reason: ${reason}`,
        entityType: "inventory",
        severity: "INFO"
      }
    });

    return toInventoryMovementDTO(result);
  }
}
