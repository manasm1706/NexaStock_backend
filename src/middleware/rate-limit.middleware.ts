import type { Middleware } from "../framework/types";
import { BadRequestError } from "../lib/errors";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(limit = 100, windowMs = 15 * 60 * 1000): Middleware {
  return async (context, next) => {
    const ip = context.request.socket.remoteAddress || "global";
    const key = `${context.tenantId || "anon"}:${ip}`;
    
    const now = Date.now();
    const rateData = rateLimitMap.get(key);
    
    if (!rateData || now > rateData.resetTime) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (rateData.count >= limit) {
      context.response.setHeader("Retry-After", String(Math.ceil((rateData.resetTime - now) / 1000)));
      throw new BadRequestError("Rate limit exceeded. Too many requests.", "RATE_LIMIT_EXCEEDED");
    }
    
    rateData.count += 1;
    return next();
  };
}
