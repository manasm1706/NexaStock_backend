export const appName = process.env.APP_NAME ?? "NexaStock API";
export const apiPrefix = process.env.API_PREFIX ?? "/api/v1";
export const defaultPort = Number(process.env.PORT ?? 4000);
export const defaultHost = process.env.HOST ?? "0.0.0.0";
export const tokenTtlHours = Number(process.env.TOKEN_TTL_HOURS ?? 12);
export const defaultTenantId = process.env.DEFAULT_TENANT_ID ?? "tenant_acme";
