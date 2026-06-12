import type { POSInvoiceDTO } from "./dto";

export function toPOSInvoiceDTO(invoice: any, locationId: string, lines: any[]): POSInvoiceDTO {
  const metadata = (invoice.metadata as Record<string, any>) || {};
  return {
    id: invoice.id,
    tenantId: invoice.tenantId,
    locationId,
    type: "sale",
    invoiceNumber: invoice.invoiceNumber,
    total: Number(invoice.grandTotal),
    subtotal: Number(invoice.subtotal),
    taxTotal: Number(invoice.taxTotal),
    discountTotal: Number(invoice.discountTotal),
    paymentMode: String(metadata.paymentMode || "cash").toLowerCase(),
    status: "posted",
    lines,
    createdAt: invoice.createdAt.toISOString(),
    customerName: metadata.customerName || undefined,
    customerPhone: metadata.customerPhone || undefined
  };
}
