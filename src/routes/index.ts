import type { AppEnv } from "../config/env";
import { appName, apiPrefix } from "../config/constants";
import type { Router } from "../framework/router";
import { prisma } from "../lib/db";
import { requireAuth } from "../middleware/auth.middleware";
import { resolveTenant } from "../middleware/tenant.middleware";

// Import route registries
import { registerAuthRoutes } from "../modules/auth/routes";
import { registerTenantRoutes } from "../modules/tenant/routes";
import { registerUsersRoutes } from "../modules/users/routes";
import { registerInventoryRoutes } from "../modules/inventory/routes";
import { registerProductsRoutes } from "../modules/products/routes";
import { registerLocationsRoutes } from "../modules/locations/routes";
import { registerTransfersRoutes } from "../modules/transfers/routes";
import { registerPOSRoutes } from "../modules/pos/routes";
import { registerAnalyticsRoutes } from "../modules/analytics/routes";
import { registerAIRoutes } from "../modules/ai/routes";
import { registerComplianceRoutes } from "../modules/compliance/routes";
import { registerProcurementRoutes } from "../modules/procurement/routes";

export function registerRoutes(router: Router, env: AppEnv): void {
  // 1. Meta / System Endpoints
  router.route("GET", "/api/v1/meta", [], () => ({
    appName: env.appName,
    apiPrefix: env.apiPrefix,
    tenantId: env.defaultTenantId,
    version: "1.0.0"
  }));

  router.route("GET", "/api/v1/health", [], async () => {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: "healthy",
      service: env.appName,
      timestamp: new Date().toISOString()
    };
  });

  router.route("GET", "/api/v1/modules", [requireAuth, resolveTenant], async (context) => {
    const locations = await prisma.location.findMany({
      where: { tenantId: context.tenantId }
    });

    return {
      inventory: true,
      warehouse: locations.some((loc) => loc.locationType !== "STORE"),
      pos: true,
      analytics: true,
      ai: true,
      supplierManagement: true,
      accounting: true
    };
  });

  // 2. Domain Module Endpoints
  registerAuthRoutes(router);
  registerTenantRoutes(router);
  registerUsersRoutes(router);
  registerInventoryRoutes(router);
  registerProductsRoutes(router);
  registerLocationsRoutes(router);
  registerTransfersRoutes(router);
  registerPOSRoutes(router);
  registerAnalyticsRoutes(router);
  registerAIRoutes(router);
  registerComplianceRoutes(router);
  registerProcurementRoutes(router);
}