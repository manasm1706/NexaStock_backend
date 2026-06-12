import { createToken, verifyToken } from "../framework/http";

export interface TokenPayload {
  sub: string;
  role: string;
  tenantId: string;
  exp: string;
}

export function generateAccessToken(
  payload: { sub: string; role: string; tenantId: string },
  expiresInHours = 24
): string {
  const secret = process.env.TOKEN_SECRET ?? "dev-secret";
  const exp = new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString();
  return createToken({ ...payload, exp }, secret);
}

export function verifyAccessToken(token: string): TokenPayload | null {
  const secret = process.env.TOKEN_SECRET ?? "dev-secret";
  const payload = verifyToken(token, secret);
  if (!payload) {
    return null;
  }

  if (typeof payload.exp === "string") {
    const isExpired = new Date(payload.exp).getTime() < Date.now();
    if (isExpired) {
      return null;
    }
  }

  return payload as unknown as TokenPayload;
}
