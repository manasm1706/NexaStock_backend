import { defaultHost, defaultPort } from "./constants";

export interface AppEnv {
  host: string;
  port: number;
  nodeEnv: string;
  appName: string;
  apiPrefix: string;
  tokenSecret: string;
  tokenTtlHours: number;
  defaultTenantId: string;
}

export function loadEnv(): AppEnv {
  return {
    host: process.env.HOST ?? defaultHost,
    port: Number(process.env.PORT ?? defaultPort),
    nodeEnv: process.env.NODE_ENV ?? "development",
    appName: process.env.APP_NAME ?? "NexaStock API",
    apiPrefix: process.env.API_PREFIX ?? "/api/v1",
    tokenSecret: process.env.TOKEN_SECRET ?? "dev-secret",
    tokenTtlHours: Number(process.env.TOKEN_TTL_HOURS ?? 12),
    defaultTenantId: process.env.DEFAULT_TENANT_ID ?? "tenant_acme"
  };
}
