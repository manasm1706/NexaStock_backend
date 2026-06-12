import { z } from "zod";

export const adjustInventorySchema = z.object({
  productId: z.string(),
  locationId: z.string(),
  quantity: z.number(),
  reason: z.string().min(1, "Reason code description is required")
});

export type AdjustInventoryInput = z.infer<typeof adjustInventorySchema>;
