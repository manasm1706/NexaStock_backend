import { z } from "zod";

const inventoryItemSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.number().min(0, "Quantity must be non-negative"),
  unit: z.string().min(1, "Unit of measure is required"),
  purchasePrice: z.number().min(0, "Purchase price must be non-negative"),
  sellingPrice: z.number().min(0, "Selling price must be non-negative")
});

export const onboardingSchema = z.object({
  organizationName: z.string().min(2, "Organization name must have at least 2 characters"),
  legalName: z.string().optional(),
  industry: z.string().min(2, "Industry description is required"),
  plan: z.string().default("professional"),
  hq: z.string().optional(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
  warehouses: z.array(z.object({
    name: z.string(),
    code: z.string(),
    address: z.string().optional(),
    capacity: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    inventory: z.array(inventoryItemSchema).optional()
  })).optional(),
  stores: z.array(z.object({
    name: z.string(),
    code: z.string(),
    city: z.string(),
    inventory: z.array(inventoryItemSchema).optional()
  })).optional(),
  businessType: z.string().optional(),
  aiPreference: z.string().optional(),
  adminUser: z.object({
    fullName: z.string().min(2, "Full name must have at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must have at least 8 characters").max(128, "Password must have at most 128 characters")
  })
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
