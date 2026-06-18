import { z } from "zod";

export const adjustInventorySchema = z.object({
  productId: z.string(),
  locationId: z.string(),
  quantity: z.number(),
  reason: z.string().min(1, "Reason code description is required")
});

export type AdjustInventoryInput = z.infer<typeof adjustInventorySchema>;

export const importInventorySchema = z.object({
  locationId: z.string().min(1, "Location ID is required"),
  fileType: z.enum(["csv", "xlsx"]),
  items: z.array(z.object({
    sku: z.string().min(1, "SKU is required"),
    name: z.string().min(1, "Product name is required"),
    category: z.string().min(1, "Category is required"),
    quantity: z.number().min(0, "Quantity must be non-negative"),
    unit: z.string().min(1, "Unit of measure is required"),
    purchasePrice: z.number().min(0, "Purchase price must be non-negative"),
    sellingPrice: z.number().min(0, "Selling price must be non-negative"),
    reorderLevel: z.number().min(0, "Reorder level must be non-negative")
  }))
});

export type ImportInventoryInput = z.infer<typeof importInventorySchema>;
