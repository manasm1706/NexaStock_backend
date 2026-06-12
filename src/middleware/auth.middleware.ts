import type { Middleware } from "../framework/types";
import { UnauthorizedError } from "../lib/errors";
import { verifyAccessToken } from "../lib/jwt";

export const requireAuth: Middleware = async (context, next) => {
  const authHeader = context.request.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authentication token is required");
  }

  const token = authHeader.slice("Bearer ".length).trim();
  const payload = verifyAccessToken(token);
  if (!payload) {
    throw new UnauthorizedError("Session has expired or token is invalid");
  }

  context.actorId = payload.sub;
  context.role = payload.role;
  context.tenantId = payload.tenantId;

  return next();
};
