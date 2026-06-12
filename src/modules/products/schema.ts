import { z } from "zod";

export const createProductSchema = z.object({
  sku: z.string().min(2, "SKU must be at least 2 characters"),
  name: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.string().min(2, "Category name must be at least 2 characters"),
  unitOfMeasure: z.string().min(1, "Unit of measure is required"),
  purchasePrice: z.number().positive({ message: "Purchase price must be positive" }),
  sellingPrice: z.number().positive({ message: "Selling price must be positive" }),
  reorderLevel: z.number().nonnegative({ message: "Reorder level cannot be negative" }),
  reorderQuantity: z.number().positive({ message: "Reorder quantity must be positive" }),
  taxRate: z.number().optional(),
  industry: z.string().min(2, "Industry tag is required"),
  brand: z.string().optional(),
  isActive: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  supplierIds: z.array(z.string()).optional()
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
