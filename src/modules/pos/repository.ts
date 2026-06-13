import { prisma, type PrismaInstance } from "../../lib/db";
import { createId } from "../../lib/crypto";

export class POSRepository {
  async getCounts(tenantId: string, tx: PrismaInstance = prisma) {
    const [productsCount, locationsCount, openInvoicesCount] = await Promise.all([
      tx.product.count({ where: { tenantId } }),
      tx.location.count({ where: { tenantId } }),
      tx.invoice.count({ where: { tenantId, invoiceStatus: { not: "VOIDED" } } })
    ]);
    return { productsCount, locationsCount, openInvoicesCount };
  }

  async findOpenSession(locationId: string, tenantId: string, tx: PrismaInstance = prisma) {
    return tx.pOSSession.findFirst({
      where: { tenantId, locationId, status: "OPEN" }
    });
  }

  async createSession(locationId: string, openedByUserId: string, tenantId: string, tx: PrismaInstance = prisma) {
    return tx.pOSSession.create({
      data: {
        id: createId("poss"),
        tenantId,
        locationId,
        openedByUserId,
        sessionNumber: createId("POSS"),
        status: "OPEN",
        openedAt: new Date()
      }
    });
  }

  async createSale(data: {
    tenantId: string;
    posSessionId: string;
    locationId: string;
    subtotal: number;
    taxTotal: number;
    discountTotal: number;
    grandTotal: number;
    createdByUserId: string;
  }, tx: PrismaInstance = prisma) {
    return tx.sale.create({
      data: {
        id: createId("sale"),
        tenantId: data.tenantId,
        posSessionId: data.posSessionId,
        locationId: data.locationId,
        saleNumber: createId("SALE"),
        status: "COMPLETED",
        subtotal: data.subtotal,
        taxTotal: data.taxTotal,
        discountTotal: data.discountTotal,
        grandTotal: data.grandTotal,
        createdByUserId: data.createdByUserId
      }
    });
  }

  async createSaleItem(data: {
    tenantId: string;
    saleId: string;
    productId: string;
    lineNumber: number;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    taxAmount: number;
    discountAmount: number;
    lineTotal: number;
  }, tx: PrismaInstance = prisma) {
    return tx.saleItem.create({
      data: {
        id: createId("salei"),
        tenantId: data.tenantId,
        saleId: data.saleId,
        productId: data.productId,
        lineNumber: data.lineNumber,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        taxRate: data.taxRate,
        taxAmount: data.taxAmount,
        discountAmount: data.discountAmount,
        lineTotal: data.lineTotal
      }
    });
  }

  async decrementInventory(productId: string, locationId: string, quantity: number, tenantId: string, tx: PrismaInstance = prisma) {
    const inv = await tx.inventory.findFirst({
      where: { tenantId, productId, locationId }
    });
    if (inv) {
      await tx.inventory.update({
        where: { id: inv.id, tenantId },
        data: {
          qtyOnHand: { decrement: quantity }
        }
      });
    }
  }

  async insertInventoryMovement(productId: string, locationId: string, quantity: number, notes: string, tenantId: string, tx: PrismaInstance = prisma) {
    return tx.inventoryMovement.create({
      data: {
        id: createId("mov"),
        tenantId,
        locationId,
        productId,
        movementType: "SALE",
        movementNumber: createId("MOV"),
        quantity: -quantity,
        notes,
        occurredAt: new Date()
      }
    });
  }

  async countInvoices(tenantId: string, tx: PrismaInstance = prisma) {
    return tx.invoice.count({ where: { tenantId } });
  }

  async createInvoice(data: {
    tenantId: string;
    saleId: string;
    invoiceNumber: string;
    subtotal: number;
    discountTotal: number;
    taxTotal: number;
    grandTotal: number;
    metadata: any;
  }, tx: PrismaInstance = prisma) {
    return tx.invoice.create({
      data: {
        id: createId("inv"),
        tenantId: data.tenantId,
        saleId: data.saleId,
        invoiceNumber: data.invoiceNumber,
        invoiceStatus: "PAID",
        subtotal: data.subtotal,
        discountTotal: data.discountTotal,
        taxTotal: data.taxTotal,
        grandTotal: data.grandTotal,
        metadata: data.metadata
      }
    });
  }
}
