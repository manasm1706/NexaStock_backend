export interface POSInvoiceLineDTO {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discount: number;
}

export interface POSInvoiceDTO {
  id: string;
  tenantId: string;
  locationId: string;
  type: "sale";
  invoiceNumber: string;
  total: number;
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  paymentMode: string;
  status: "posted";
  lines: POSInvoiceLineDTO[];
  createdAt: string;
  customerName?: string;
  customerPhone?: string;
}
