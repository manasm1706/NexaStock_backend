import type { IncomingMessage, ServerResponse } from "node:http";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RouteParams {
  [key: string]: string;
}

export interface RequestContext {
  request: IncomingMessage;
  response: ServerResponse;
  params: RouteParams;
  query: URLSearchParams;
  body: unknown;
  tenantId: string;
  requestId: string;
  actorId?: string;
  role?: string;
}

export type RouteHandler = (context: RequestContext) => Promise<unknown> | unknown;

export type NextFunction = () => Promise<unknown>;
export type Middleware = (context: RequestContext, next: NextFunction) => Promise<unknown> | unknown;

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handler: RouteHandler;
}
