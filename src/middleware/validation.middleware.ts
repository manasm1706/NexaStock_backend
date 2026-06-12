import type { ZodTypeAny } from "zod";
import type { Middleware } from "../framework/types";
import { ValidationError } from "../lib/errors";

export function validateBody(schema: ZodTypeAny): Middleware {
  return async (context, next) => {
    const parsed = schema.safeParse(context.body);
    if (!parsed.success) {
      throw new ValidationError("Request validation failed", parsed.error.format());
    }
    context.body = parsed.data;
    return next();
  };
}

export function validateQuery(schema: ZodTypeAny): Middleware {
  return async (context, next) => {
    const queryObj = Object.fromEntries(context.query.entries());
    const parsed = schema.safeParse(queryObj);
    if (!parsed.success) {
      throw new ValidationError("Query validation failed", parsed.error.format());
    }
    const searchParams = new URLSearchParams();
    for (const [key, val] of Object.entries(parsed.data as Record<string, unknown>)) {
      if (val !== undefined && val !== null) {
        searchParams.set(key, String(val));
      }
    }
    context.query = searchParams;
    return next();
  };
}

export function validateParams(schema: ZodTypeAny): Middleware {
  return async (context, next) => {
    const parsed = schema.safeParse(context.params);
    if (!parsed.success) {
      throw new ValidationError("Route params validation failed", parsed.error.format());
    }
    context.params = parsed.data as any;
    return next();
  };
}
