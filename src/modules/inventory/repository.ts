import { prisma, type PrismaInstance } from "../../lib/db";
import { createId } from "../../lib/crypto";

export class InventoryRepository {
  async findBalances(tenantId: string, tx: PrismaInstance = prisma) {
    return tx.inventory.findMany({
      where: { tenantId }
    });
  }

  async findMovements(tenantId: string, tx: PrismaInstance = prisma) {
    return tx.inventoryMovement.findMany({
      where: { tenantId },
      orderBy: { occurredAt: "desc" }
    });
  }

  async findInventoryRecord(productId: string, locationId: string, tenantId: string, tx: PrismaInstance = prisma) {
    return tx.inventory.findFirst({
      where: { tenantId, productId, locationId }
    });
  }

  async createInventoryRecord(productId: string, locationId: string, qtyOnHand: number, tenantId: string, tx: PrismaInstance = prisma) {
    return tx.inventory.create({
      data: {
        id: createId("inv"),
        tenantId,
        productId,
        locationId,
        qtyOnHand,
        qtyReserved: 0
      }
    });
  }

  async updateInventoryRecordQty(id: string, incrementQty: number, tenantId: string, tx: PrismaInstance = prisma) {
    return tx.inventory.update({
      where: { id, tenantId },
      data: {
        qtyOnHand: { increment: incrementQty }
      }
    });
  }

  async insertMovement(productId: string, locationId: string, quantity: number, notes: string, tenantId: string, tx: PrismaInstance = prisma) {
    return tx.inventoryMovement.create({
      data: {
        id: createId("mov"),
        tenantId,
        locationId,
        productId,
        movementType: "ADJUSTMENT",
        movementNumber: createId("MOV"),
        quantity,
        notes,
        occurredAt: new Date()
      }
    });
  }

  async insertStockAdjustment(inventoryId: string, quantityBefore: number, quantityAfter: number, varianceQty: number, reasonCode: string, tenantId: string, tx: PrismaInstance = prisma) {
    return tx.stockAdjustment.create({
      data: {
        id: createId("sadj"),
        tenantId,
        inventoryId,
        adjustmentNumber: createId("ADJ"),
        quantityBefore,
        quantityAfter,
        varianceQty,
        reasonCode,
        status: "CONFIRMED"
      }
    });
  }
}
