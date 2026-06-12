import { z } from "zod";

export const createPOSInvoiceSchema = z.object({
  locationId: z.string(),
  paymentMode: z.string(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  lines: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      quantity: z.number().positive("Quantity must be greater than zero"),
      unitPrice: z.number().positive("Unit price must be positive"),
      taxRate: z.number().nonnegative().optional(),
      discount: z.number().nonnegative().optional()
    })
  ).min(1, "Invoice must contain at least one line item")
});

export type CreatePOSInvoiceInput = z.infer<typeof createPOSInvoiceSchema>;
