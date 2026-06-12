import { createServer } from "node:http";
import { apiPrefix, appName } from "./config/constants";
import { loadEnv } from "./config/env";
import { Router } from "./framework/router";
import { sendJson, sendText } from "./framework/http";
import { badRequest } from "./framework/errors";
import { registerRoutes } from "./routes";

export interface AppServer {
  listen(): void;
}

export function createApp(): AppServer {
  const env = loadEnv();
  const router = new Router();
  registerRoutes(router, env);

  const server = createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://localhost");

    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, {
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
      error: {
        code: "NOT_FOUND",
        message: badRequest("Route not found").message
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
