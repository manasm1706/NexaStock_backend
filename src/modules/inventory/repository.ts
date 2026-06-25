import { prisma, type PrismaInstance } from "../../lib/db";
import { createId } from "../../lib/crypto";

export class InventoryRepository {
  async findBalances(tenantId: string, locationIds?: string[], tx: PrismaInstance = prisma) {
    const where: any = { tenantId };
    if (locationIds) {
      where.locationId = { in: locationIds };
    }
    return tx.inventory.findMany({
      where
    });
  }

  async findMovements(tenantId: string, locationIds?: string[], tx: PrismaInstance = prisma) {
    const where: any = { tenantId };
    if (locationIds) {
      where.locationId = { in: locationIds };
    }
    return tx.inventoryMovement.findMany({
      where,
      orderBy: { occurredAt: "desc" }
    });
  }

  async findInventoryRecord(productId: string, locationId: string, tenantId: string, tx: PrismaInstance = prisma) {
    return tx.inventory.findFirst({
      where: { tenantId, productId, locationId }
    });
  }

  async createInventoryRecord(
    productId: string,
    locationId: string,
    qtyOnHand: number,
    tenantId: string,
    auditMeta?: any,
    tx: PrismaInstance = prisma
  ) {
    return tx.inventory.create({
      data: {
        id: createId("inv"),
        tenantId,
        productId,
        locationId,
        qtyOnHand,
        qtyReserved: 0,
        metadata: auditMeta
      }
    });
  }

  async updateInventoryRecordQty(id: string, incrementQty: number, tenantId: string, auditMeta?: any, tx: PrismaInstance = prisma) {
    // If auditMeta is provided, we can fetch, merge, and update. Or just increment.
    // To be fast, we increment. If we need to write metadata, we update the metadata JSON field as well.
    return tx.inventory.update({
      where: { id, tenantId },
      data: {
        qtyOnHand: { increment: incrementQty },
        ...(auditMeta ? { metadata: auditMeta } : {})
      }
    });
  }

  async insertMovement(
    productId: string,
    locationId: string,
    quantity: number,
    notes: string,
    tenantId: string,
    auditMeta?: any,
    tx: PrismaInstance = prisma
  ) {
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
        occurredAt: new Date(),
        metadata: auditMeta
      }
    });
  }

  async insertStockAdjustment(
    inventoryId: string,
    quantityBefore: number,
    quantityAfter: number,
    varianceQty: number,
    reasonCode: string,
    tenantId: string,
    auditMeta?: any,
    tx: PrismaInstance = prisma
  ) {
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
        status: "CONFIRMED",
        metadata: auditMeta
      }
    });
  }
}
