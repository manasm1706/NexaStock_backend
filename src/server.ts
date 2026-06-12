import { createServer } from "node:http";
import { apiPrefix, appName } from "./config/constants";
import { loadEnv } from "./config/env";
import { Router } from "./framework/router";
import { sendJson, sendText } from "./framework/http";
import { registerRoutes } from "./routes";

export interface AppServer {
  listen(): void;
}

export function createApp(): AppServer {
  const env = loadEnv();
  const router = new Router();
  registerRoutes(router, env);

  const server = createServer(async (request, response) => {
    // 1. CORS Configuration
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-tenant-id");
    response.setHeader("Access-Control-Max-Age", "86400"); // 24 hours

    // 2. Helmet Security Headers
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("X-Frame-Options", "DENY");
    response.setHeader("X-XSS-Protection", "1; mode=block");

    // Handle CORS preflight options request
    if (request.method === "OPTIONS") {
      response.statusCode = 204;
      response.end();
      return;
    }

    const url = new URL(request.url ?? "/", "http://localhost");

    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, {
        success: true,
        data: {
          status: "ok",
          appName,
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    if (url.pathname.startsWith(apiPrefix)) {
      await router.handle(request, response);
      return;
    }

    if (request.method === "GET" && url.pathname === "/") {
      sendText(response, 200, `${appName} is running`);
      return;
    }

    sendJson(response, 404, {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Resource not found"
      }
    });
  });

  return {
    listen() {
      server.listen(env.port, env.host, () => {
        // eslint-disable-next-line no-console
        console.log(`${appName} listening on http://${env.host}:${env.port}${apiPrefix}`);
      });
    }
  };
}
