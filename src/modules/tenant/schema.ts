import { z } from "zod";

export const onboardingSchema = z.object({
  organizationName: z.string().min(2, "Organization name must have at least 2 characters"),
  legalName: z.string().optional(),
  industry: z.string().min(2, "Industry description is required"),
  plan: z.string().default("professional"),
  hq: z.string().optional(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
  warehouse: z.object({
    name: z.string(),
    code: z.string(),
    address: z.string().optional(),
    capacity: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
  stores: z.array(z.object({
    name: z.string(),
    code: z.string(),
    city: z.string()
  })).optional(),
  aiPreference: z.string().optional(),
  adminUser: z.object({
    fullName: z.string().min(2, "Full name must have at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must have at least 6 characters")
  })
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
