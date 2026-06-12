import { z } from "zod";

export const onboardingSchema = z.object({
  organizationName: z.string().min(2, "Organization name must have at least 2 characters"),
  industry: z.string().min(2, "Industry description is required"),
  plan: z.string()
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
