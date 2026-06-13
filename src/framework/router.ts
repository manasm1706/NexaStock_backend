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
      const result = await tenantLocalStorage.run(context, () => matchedRoute.handler(context));

      if (response.writableEnded) {
        return;
      }

      if (typeof result === "undefined") {
        sendJson(response, 204, null);
        return;
      }

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
    console.error("[Router Error]", error);
    const response = context.response;

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
