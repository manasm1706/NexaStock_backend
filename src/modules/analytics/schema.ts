import { z } from "zod";

export const queryAnalyticsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

export type QueryAnalyticsInput = z.infer<typeof queryAnalyticsSchema>;
