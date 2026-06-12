import { randomUUID, createHmac } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { HttpError } from "./errors";
import type { RequestContext } from "./types";

export interface JsonResponse {
  statusCode: number;
  payload: unknown;
}

export function createRequestId(): string {
  return randomUUID();
}

export function sendJson(response: ServerResponse, statusCode: number, payload: unknown): void {
  response.statusCode = statusCode;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

export function sendText(response: ServerResponse, statusCode: number, payload: string): void {
  response.statusCode = statusCode;
  response.setHeader("content-type", "text/plain; charset=utf-8");
  response.end(payload);
}

export async function readBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  if (chunks.length === 0) {
    return undefined;
  }

  const raw = Buffer.concat(chunks).toString("utf-8").trim();
  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new HttpError(400, "INVALID_JSON", "Request body must be valid JSON");
  }
}

export function createToken(payload: Record<string, unknown>, secret: string): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(encodedPayload).digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function verifyToken(token: string, secret: string): Record<string, unknown> | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = createHmac("sha256", secret).update(encodedPayload).digest("base64url");
  if (expectedSignature !== signature) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf-8"));
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function authFromRequest(request: IncomingMessage): { actorId?: string; role?: string; tenantId?: string } {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {};
  }

  const token = authHeader.slice("Bearer ".length);
  const secret = process.env.TOKEN_SECRET ?? "dev-secret";
  const payload = verifyToken(token, secret);
  if (!payload) {
    return {};
  }

    const result: { actorId?: string; role?: string; tenantId?: string } = {};

    if (typeof payload.sub === "string") {
      result.actorId = payload.sub;
    }

    if (typeof payload.role === "string") {
      result.role = payload.role;
    }

    if (typeof payload.tenantId === "string") {
      result.tenantId = payload.tenantId;
    }

    return result;
}

export function buildContext(request: IncomingMessage, response: ServerResponse): RequestContext {
  const url = new URL(request.url ?? "/", "http://localhost");
  const auth = authFromRequest(request);
  const tenantId = (request.headers["x-tenant-id"] as string | undefined) ?? auth.tenantId ?? process.env.DEFAULT_TENANT_ID ?? "tenant_acme";

  const context: RequestContext = {
    request,
    response,
    params: {},
    query: url.searchParams,
    body: undefined,
    tenantId,
    requestId: createRequestId()
  };

  if (typeof auth.actorId === "string") {
    context.actorId = auth.actorId;
  }

  if (typeof auth.role === "string") {
    context.role = auth.role;
  }

  return context;
}
