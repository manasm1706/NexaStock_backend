import { z } from "zod";

export const queryAISchema = z.object({
  limit: z.string().optional()
});

export type QueryAIInput = z.infer<typeof queryAISchema>;
