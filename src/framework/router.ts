import type { IncomingMessage, ServerResponse } from "node:http";
import { HttpError, notFound } from "./errors";
import { buildContext, readBody, sendJson } from "./http";
import type { HttpMethod, RequestContext, RouteDefinition, RouteParams } from "./types";

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

export class Router {
  private readonly routes: RouteDefinition[] = [];

  register(route: RouteDefinition): this {
    this.routes.push(route);
    return this;
  }

  route(method: HttpMethod, path: string, handler: RouteDefinition["handler"]): this {
    return this.register({ method, path, handler });
  }

  async handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const method = request.method?.toUpperCase() as HttpMethod | undefined;
    const requestPath = new URL(request.url ?? "/", "http://localhost").pathname;
    const matchedRoute = this.routes.find((route) => route.method === method && matchPath(route.path, requestPath));

    if (!method || !matchedRoute) {
      sendJson(response, 404, {
        error: {
          code: "NOT_FOUND",
          message: notFound().message
        }
      });
      return;
    }

    const context = buildContext(request, response);
    context.params = matchPath(matchedRoute.path, requestPath) ?? {};

    try {
      context.body = await readBody(request);
      const result = await matchedRoute.handler(context);

      if (response.writableEnded) {
        return;
      }

      if (typeof result === "undefined") {
        sendJson(response, 204, null);
        return;
      }

      sendJson(response, 200, {
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

    if (error instanceof HttpError) {
      sendJson(response, error.statusCode, {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
          requestId: context.requestId
        }
      });
      return;
    }

    const message = error instanceof Error ? error.message : "Unexpected error";
    sendJson(response, 500, {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message,
        requestId: context.requestId
      }
    });
  }
}
