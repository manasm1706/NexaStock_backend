import { z } from "zod";

export const createLocationSchema = z.object({
  name: z.string().min(2, "Location name must be at least 2 characters"),
  code: z.string().min(2, "Location code must be at least 2 characters"),
  type: z.enum(["store", "warehouse", "external_warehouse", "STORE", "WAREHOUSE", "EXTERNAL_WAREHOUSE"]),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required")
});

export type CreateLocationInput = z.infer<typeof createLocationSchema>;
