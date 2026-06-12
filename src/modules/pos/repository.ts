import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";

export class POSRepository {
  async getCounts(tenantId: string) {
    const [productsCount, locationsCount, openInvoicesCount] = await Promise.all([
      prisma.product.count({ where: { tenantId } }),
      prisma.location.count({ where: { tenantId } }),
      prisma.invoice.count({ where: { tenantId, invoiceStatus: { not: "VOIDED" } } })
    ]);
    return { productsCount, locationsCount, openInvoicesCount };
  }

  async findOpenSession(locationId: string, tenantId: string) {
    return prisma.pOSSession.findFirst({
      where: { tenantId, locationId, status: "OPEN" }
    });
  }

  async createSession(locationId: string, openedByUserId: string, tenantId: string) {
    return prisma.pOSSession.create({
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
  }) {
    return prisma.sale.create({
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
  }) {
    return prisma.saleItem.create({
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

  async decrementInventory(productId: string, locationId: string, quantity: number, tenantId: string) {
    const inv = await prisma.inventory.findFirst({
      where: { tenantId, productId, locationId }
    });
    if (inv) {
      await prisma.inventory.update({
        where: { id: inv.id },
        data: {
          qtyOnHand: { decrement: quantity }
        }
      });
    }
  }

  async insertInventoryMovement(productId: string, locationId: string, quantity: number, notes: string, tenantId: string) {
    return prisma.inventoryMovement.create({
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

  async countInvoices(tenantId: string) {
    return prisma.invoice.count({ where: { tenantId } });
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
  }) {
    return prisma.invoice.create({
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
