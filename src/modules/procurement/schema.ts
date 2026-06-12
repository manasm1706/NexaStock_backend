import { z } from "zod";

export const queryProcurementSchema = z.object({
  search: z.string().optional()
});

export type QueryProcurementInput = z.infer<typeof queryProcurementSchema>;
