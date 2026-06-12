import { z } from "zod";

export const createTransferSchema = z.object({
  fromLocationId: z.string(),
  toLocationId: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      requestedQuantity: z.number().positive("Quantity must be greater than zero")
    })
  ).min(1, "Transfer request must contain at least one item")
});

export type CreateTransferInput = z.infer<typeof createTransferSchema>;
