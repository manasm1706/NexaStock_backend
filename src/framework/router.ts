import type { IncomingMessage, ServerResponse } from "node:http";
import { AppError, NotFoundError } from "../lib/errors";
import { buildContext, readBody, sendJson } from "./http";
import type { HttpMethod, RequestContext, RouteDefinition, RouteParams, RouteHandler, Middleware } from "./types";
import { tenantLocalStorage } from "../lib/context";

function splitPath(path: string): string[] {
  return path.split("/").filter(Boolean);
}

function matchPath(routePath: string, requestPath: string): RouteParams | null {
  const routeSegments = splitPath(routePath);
  const requestSegments = splitPath(requestPath);

  if (routeSegments.length !== requestSegments.length) {
    return null;
  }

  const params: RouteParams = {};
  for (let index = 0; index < routeSegments.length; index += 1) {
    const expected = routeSegments[index];
    if (!expected) {
      return null;
    }
    const actual = requestSegments[index];
    if (expected.startsWith(":")) {
      params[expected.slice(1)] = decodeURIComponent(actual ?? "");
      continue;
    }

    if (expected !== actual) {
      return null;
    }
  }

  return params;
}

export function compose(middlewares: Middleware[]) {
  return (handler: RouteHandler): RouteHandler => {
    return (context: RequestContext) => {
      let index = -1;
      function dispatch(i: number): Promise<unknown> {
        if (i <= index) {
          return Promise.reject(new Error("next() called multiple times"));
        }
        index = i;
        const fn = middlewares[i];
        if (i === middlewares.length) {
          return Promise.resolve(handler(context));
        }
        if (!fn) return Promise.resolve();
        try {
          return Promise.resolve(fn(context, () => dispatch(i + 1)));
        } catch (err) {
          return Promise.reject(err);
        }
      }
      return dispatch(0);
    };
  };
}

export class Router {
  private readonly routes: RouteDefinition[] = [];

  register(route: RouteDefinition): this {
    this.routes.push(route);
    return this;
  }

  route(
    method: HttpMethod,
    path: string,
    middlewaresOrHandler: Middleware[] | RouteHandler,
    handler?: RouteHandler
  ): this {
    let finalHandler: RouteHandler;
    if (Array.isArray(middlewaresOrHandler)) {
      finalHandler = compose(middlewaresOrHandler)(handler!);
    } else {
      finalHandler = middlewaresOrHandler;
    }
    return this.register({ method, path, handler: finalHandler });
  }

  async handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const method = request.method?.toUpperCase() as HttpMethod | undefined;
    const requestPath = new URL(request.url ?? "/", "http://localhost").pathname;
    const matchedRoute = this.routes.find((route) => route.method === method && matchPath(route.path, requestPath));

    if (!method || !matchedRoute) {
      sendJson(response, 404, {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Route not found"
        }
      });
      return;
    }

    const context = buildContext(request, response);
    context.params = matchPath(matchedRoute.path, requestPath) ?? {};

    try {
      context.body = await readBody(request);

      console.log(`[Request] ${method} ${requestPath} | requestId: ${context.requestId} | tenantId: ${context.tenantId} | actorId: ${context.actorId || "none"}`);

      const result = await tenantLocalStorage.run(context, () => matchedRoute.handler(context));

      if (response.writableEnded) {
        console.log(`[Response Completed Externally] ${method} ${requestPath} | requestId: ${context.requestId} | status: ${response.statusCode}`);
        return;
      }

      if (typeof result === "undefined") {
        console.log(`[Response Success] ${method} ${requestPath} | requestId: ${context.requestId} | status: 204`);
        sendJson(response, 204, null);
        return;
      }

      console.log(`[Response Success] ${method} ${requestPath} | requestId: ${context.requestId} | status: 200`);
      sendJson(response, 200, {
        success: true,
        data: result,
        meta: {
          requestId: context.requestId,
          tenantId: context.tenantId
        }
      });
    } catch (error) {
      this.handleError(error, context);
    }
  }

  private handleError(error: unknown, context: RequestContext): void {
    const response = context.response;
    const isAppError = error instanceof AppError;
    const statusCode = isAppError ? error.statusCode : 500;
    const errorCode = isAppError ? error.code : "INTERNAL_SERVER_ERROR";
    const errorMessage = error instanceof Error ? error.message : "Unexpected error";

    console.error(`[Response Error] ${context.request.method} ${context.request.url} | status: ${statusCode} | code: ${errorCode} | message: ${errorMessage} | requestId: ${context.requestId} | actorId: ${context.actorId || "none"}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }

    if (error instanceof AppError) {
      sendJson(response, error.statusCode, {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
          requestId: context.requestId
        }
      });
      return;
    }

    // Prisma-specific error classification
    const prismaCode = (error as any)?.code;
    const prismaMeta = (error as any)?.meta;

    if (prismaCode === "P2002") {
      // Unique constraint violation
      const target = prismaMeta?.target;
      let message = "A record with this data already exists.";
      if (Array.isArray(target)) {
        if (target.includes("email")) message = "This email address is already registered.";
        else if (target.includes("slug")) message = "An organization with this name already exists.";
        else if (target.includes("storeCode")) message = "A store with this code already exists.";
        else if (target.includes("warehouseCode")) message = "A warehouse with this code already exists.";
        else if (target.includes("sku")) message = "A product with this SKU already exists.";
        else message = `Duplicate value detected for: ${target.join(", ")}`;
      }
      sendJson(response, 409, {
        success: false,
        error: {
          code: "DUPLICATE_RECORD",
          message,
          requestId: context.requestId
        }
      });
      return;
    }

    if (prismaCode === "P2022" || prismaCode === "P2025") {
      console.error("[Prisma Schema Error]", { code: prismaCode, meta: prismaMeta });
      sendJson(response, 500, {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: `Database error: ${(error as Error).message}`,
          requestId: context.requestId
        }
      });
      return;
    }

    if (prismaCode && prismaCode.startsWith("P")) {
      console.error("[Prisma Error]", { code: prismaCode, meta: prismaMeta, message: (error as Error).message });
      sendJson(response, 500, {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "We couldn't complete your request due to a database issue. Please try again in a few moments.",
          requestId: context.requestId
        }
      });
      return;
    }

    const message = error instanceof Error ? error.message : "Unexpected error";
    sendJson(response, 500, {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message,
        requestId: context.requestId
      }
    });
  }
}
