import { POSRepository } from "./repository";
import { toPOSInvoiceDTO } from "./mapper";
import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";
import type { CreatePOSInvoiceInput } from "./schema";

export class POSService {
  private readonly repository = new POSRepository();

  async getSummary(tenantId: string) {
    const { productsCount, locationsCount, openInvoicesCount } = await this.repository.getCounts(tenantId);
    return {
      products: productsCount,
      locations: locationsCount,
      openInvoices: openInvoicesCount
    };
  }

  async checkout(input: CreatePOSInvoiceInput, actorId: string, tenantId: string) {
    const { locationId, paymentMode, customerName, customerPhone, lines } = input;

    const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
    const discountTotal = lines.reduce((sum, line) => sum + (line.discount || 0), 0);
    const taxTotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice * ((line.taxRate || 0) / 100), 0);
    const total = subtotal - discountTotal + taxTotal;

    const invoice = await prisma.$transaction(async (tx) => {
      // 1. Session resolution
      let session = await this.repository.findOpenSession(locationId, tenantId, tx);
      if (!session) {
        session = await this.repository.createSession(locationId, actorId, tenantId, tx);
      }

      // 2. Create Sale
      const sale = await this.repository.createSale({
        tenantId,
        posSessionId: session.id,
        locationId,
        subtotal,
        taxTotal,
        discountTotal,
        grandTotal: total,
        createdByUserId: actorId
      }, tx);

      // 3. Create Sale Items, Deduct Inventory, Record Movements
      let lineNum = 1;
      for (const line of lines) {
        const taxRate = line.taxRate || 0;
        const discountAmount = line.discount || 0;
        const taxAmount = (line.quantity * line.unitPrice) * (taxRate / 100);
        const lineTotal = (line.quantity * line.unitPrice) - discountAmount + taxAmount;

        await this.repository.createSaleItem({
          tenantId,
          saleId: sale.id,
          productId: line.productId,
          lineNumber: lineNum++,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          taxRate,
          taxAmount,
          discountAmount,
          lineTotal
        }, tx);

        // Deduct inventory
        await this.repository.decrementInventory(line.productId, locationId, line.quantity, tenantId, tx);

        // Record movement log
        await this.repository.insertInventoryMovement(line.productId, locationId, line.quantity, `POS Sale ${sale.id}`, tenantId, tx);
      }

      // 4. Create Invoice
      const invoiceCount = await this.repository.countInvoices(tenantId, tx);
      const invoiceNum = `INV-${String(invoiceCount + 1).padStart(6, "0")}`;

      return this.repository.createInvoice({
        tenantId,
        saleId: sale.id,
        invoiceNumber: invoiceNum,
        subtotal,
        discountTotal,
        taxTotal,
        grandTotal: total,
        metadata: {
          customerName,
          customerPhone,
          paymentMode: paymentMode.toUpperCase()
        }
      }, tx);
    });

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId: actorId,
        module: "pos",
        action: "invoice_created",
        summary: `Invoice ${invoice.invoiceNumber} posted at location ${locationId} with total ${total}`,
        entityType: "invoice",
        severity: "INFO"
      }
    });

    return toPOSInvoiceDTO(invoice, locationId, lines);
  }
}
