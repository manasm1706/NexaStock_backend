import { POSRepository } from "./repository";
import { toPOSInvoiceDTO } from "./mapper";
import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";
import { buildAuditMetadata } from "../../lib/locationScoper";
import { ForbiddenError } from "../../lib/errors";
import type { CreatePOSInvoiceInput } from "./schema";
import { AnalyticsService } from "../analytics/service";
import { AIService } from "../ai/service";

export class POSService {
  private readonly repository = new POSRepository();

  async getSummary(tenantId: string, locationIds?: string[]) {
    const { productsCount, locationsCount, openInvoicesCount } = await this.repository.getCounts(tenantId, locationIds);
    return {
      products: productsCount,
      locations: locationsCount,
      openInvoices: openInvoicesCount
    };
  }

  async checkout(input: CreatePOSInvoiceInput, actorId: string, roleCode: string, tenantId: string, locationIds?: string[]) {
    const { locationId, paymentMode, customerName, customerPhone, lines } = input;

    // Check location permission scope
    if (locationIds && !locationIds.includes(locationId)) {
      throw new ForbiddenError("You do not have permission to execute POS checkout at this location");
    }

    const auditMeta = buildAuditMetadata(actorId, roleCode, locationId, {
      customerName,
      customerPhone,
      paymentMode: paymentMode.toUpperCase()
    });

    const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
    const discountTotal = lines.reduce((sum, line) => sum + (line.discount || 0), 0);
    
    // Calculate tax on net price per line item (subtotal - discount)
    const taxTotal = lines.reduce((sum, line) => {
      const lineSubtotal = line.quantity * line.unitPrice;
      const lineDiscount = line.discount || 0;
      const netAmount = Math.max(0, lineSubtotal - lineDiscount);
      return sum + netAmount * ((line.taxRate || 0) / 100);
    }, 0);
    
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
        createdByUserId: actorId,
        metadata: auditMeta
      }, tx);

      // 3. Create Sale Items, Deduct Inventory, Record Movements
      let lineNum = 1;
      for (const line of lines) {
        const taxRate = line.taxRate || 0;
        const discountAmount = line.discount || 0;
        const lineSubtotal = line.quantity * line.unitPrice;
        const netAmount = Math.max(0, lineSubtotal - discountAmount);
        const taxAmount = netAmount * (taxRate / 100);
        const lineTotal = lineSubtotal - discountAmount + taxAmount;

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

        // Deduct inventory (with hard stock check validation inside decrementInventory)
        await this.repository.decrementInventory(line.productId, locationId, line.quantity, tenantId, tx);

        // Record movement log
        await this.repository.insertInventoryMovement(line.productId, locationId, line.quantity, `POS Sale ${sale.id}`, tenantId, tx);
      }

      // 4. Create Payment record to map payment method
      const allowedPaymentModes = ["CASH", "CARD", "UPI", "WALLET"] as const;
      const modeUpper = paymentMode.toUpperCase() as typeof allowedPaymentModes[number];
      const validMode = allowedPaymentModes.includes(modeUpper) ? modeUpper : "CASH";
      await this.repository.createPayment({
        tenantId,
        saleId: sale.id,
        method: validMode,
        amount: total
      }, tx);

      // 5. Create Invoice
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
        metadata: auditMeta
      }, tx);
    });

    // Clear analytics cache for this tenant since a sale completed
    AnalyticsService.clearCache(tenantId);
    AIService.clearCache(tenantId);

    // Write Audit Log with cashier and location details
    try {
      const [cashier, location] = await Promise.all([
        prisma.user.findUnique({ where: { id: actorId } }),
        prisma.location.findUnique({ where: { id: locationId } })
      ]);
      const cashierName = cashier?.fullName || "POS Cashier";
      const locationName = location?.name || locationId;

      await prisma.auditLog.create({
        data: {
          id: createId("audit"),
          tenantId,
          actorUserId: actorId,
          module: "pos",
          action: "invoice_created",
          summary: `POS checkout completed by cashier ${cashierName} at store ${locationName}. Invoice: ${invoice.invoiceNumber}. Mode: ${paymentMode.toUpperCase()}. Total: $${total.toFixed(2)}.`,
          entityType: "invoice",
          severity: "INFO",
          afterData: {
            cashierName,
            locationName,
            invoiceNumber: invoice.invoiceNumber,
            grandTotal: total,
            paymentMode: paymentMode.toUpperCase(),
            customerName,
            customerPhone,
            ...auditMeta
          }
        }
      });
    } catch (auditError) {
      console.error("Failed to write POS audit log:", auditError);
    }

    return toPOSInvoiceDTO(invoice, locationId, lines);
  }
}
