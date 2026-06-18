import { InventoryRepository } from "./repository";
import { toInventoryBalanceDTO, toInventoryMovementDTO } from "./mapper";
import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";
import type { AdjustInventoryInput, ImportInventoryInput } from "./schema";

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

    const result = await prisma.$transaction(async (tx) => {
      let inv = await this.repository.findInventoryRecord(productId, locationId, tenantId, tx);
      let qtyBefore = 0;

      if (!inv) {
        inv = await this.repository.createInventoryRecord(productId, locationId, quantity, tenantId, tx);
      } else {
        qtyBefore = inv.qtyOnHand;
        inv = await this.repository.updateInventoryRecordQty(inv.id, quantity, tenantId, tx);
      }

      const movement = await this.repository.insertMovement(productId, locationId, quantity, reason, tenantId, tx);
      await this.repository.insertStockAdjustment(inv.id, qtyBefore, inv.qtyOnHand, quantity, reason, tenantId, tx);

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

  async bulkImportInventory(input: ImportInventoryInput, actorId: string, tenantId: string) {
    const { locationId, items } = input;

    const stats = {
      created: 0,
      updated: 0,
      total: items.length
    };

    await prisma.$transaction(async (tx) => {
      // Fetch tenant's industry to populate for new products
      const tenant = await tx.tenant.findUnique({
        where: { id: tenantId }
      });
      const defaultIndustry = tenant?.industry || "general";

      for (const item of items) {
        const catName = item.category.trim();
        let category = await tx.productCategory.findFirst({
          where: { name: catName, tenantId }
        });

        if (!category) {
          const catCode = catName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "uncategorized";
          category = await tx.productCategory.create({
            data: {
              id: createId("cat"),
              tenantId,
              code: catCode,
              name: catName,
              slug: catCode
            }
          });
        }

        let product = await tx.product.findFirst({
          where: { sku: item.sku, tenantId }
        });

        if (!product) {
          const productId = createId("prod");
          product = await tx.product.create({
            data: {
              id: productId,
              tenantId,
              categoryId: category.id,
              sku: item.sku,
              name: item.name,
              unitOfMeasure: item.unit,
              reorderLevel: item.reorderLevel,
              reorderQuantity: 0,
              industry: defaultIndustry,
              isActive: true,
              metadata: {
                purchasePrice: item.purchasePrice,
                sellingPrice: item.sellingPrice
              }
            }
          });
          stats.created++;
        } else {
          const existingMeta = (product.metadata as Record<string, any>) || {};
          const updatedMeta = {
            ...existingMeta,
            purchasePrice: item.purchasePrice,
            sellingPrice: item.sellingPrice
          };
          product = await tx.product.update({
            where: { id: product.id },
            data: {
              name: item.name,
              categoryId: category.id,
              unitOfMeasure: item.unit,
              reorderLevel: item.reorderLevel,
              metadata: updatedMeta
            }
          });
          stats.updated++;
        }

        let inventory = await tx.inventory.findFirst({
          where: {
            tenantId,
            locationId,
            productId: product.id
          }
        });

        if (!inventory) {
          const invId = createId("inv");
          inventory = await tx.inventory.create({
            data: {
              id: invId,
              tenantId,
              locationId,
              productId: product.id,
              qtyOnHand: item.quantity,
              qtyReserved: 0
            }
          });

          if (item.quantity > 0) {
            const movId = createId("mov");
            await tx.inventoryMovement.create({
              data: {
                id: movId,
                tenantId,
                locationId,
                productId: product.id,
                movementType: "INWARD",
                movementNumber: createId("MOV"),
                quantity: item.quantity,
                notes: `Bulk Import initial stock input`,
                occurredAt: new Date()
              }
            });

            const sadjId = createId("sadj");
            await tx.stockAdjustment.create({
              data: {
                id: sadjId,
                tenantId,
                inventoryId: inventory.id,
                adjustmentNumber: createId("ADJ"),
                quantityBefore: 0,
                quantityAfter: item.quantity,
                varianceQty: item.quantity,
                reasonCode: "IMPORT",
                status: "CONFIRMED"
              }
            });
          }
        } else {
          if (item.quantity > 0) {
            const qtyBefore = inventory.qtyOnHand;
            const qtyAfter = qtyBefore + item.quantity;
            inventory = await tx.inventory.update({
              where: { id: inventory.id },
              data: {
                qtyOnHand: { increment: item.quantity }
              }
            });

            const movId = createId("mov");
            await tx.inventoryMovement.create({
              data: {
                id: movId,
                tenantId,
                locationId,
                productId: product.id,
                movementType: "INWARD",
                movementNumber: createId("MOV"),
                quantity: item.quantity,
                notes: `Bulk Import incremental stock increment`,
                occurredAt: new Date()
              }
            });

            const sadjId = createId("sadj");
            await tx.stockAdjustment.create({
              data: {
                id: sadjId,
                tenantId,
                inventoryId: inventory.id,
                adjustmentNumber: createId("ADJ"),
                quantityBefore: qtyBefore,
                quantityAfter: qtyAfter,
                varianceQty: item.quantity,
                reasonCode: "IMPORT",
                status: "CONFIRMED"
              }
            });
          }
        }
      }
    });

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId: actorId,
        module: "inventory",
        action: "import",
        summary: `Imported ${stats.total} inventory items via bulk import (${stats.created} created, ${stats.updated} updated).`,
        entityType: "inventory",
        severity: "INFO"
      }
    });

    return stats;
  }
}
