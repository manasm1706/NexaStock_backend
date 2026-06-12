import { z } from "zod";

export const queryUsersSchema = z.object({
  search: z.string().optional()
});

export type QueryUsersInput = z.infer<typeof queryUsersSchema>;
