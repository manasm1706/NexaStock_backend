import { z } from "zod";

export const queryAuditSchema = z.object({
  module: z.string().optional()
});

export type QueryAuditInput = z.infer<typeof queryAuditSchema>;
