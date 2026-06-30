import type { AppEnv } from "../config/env";
import { appName, apiPrefix } from "../config/constants";
import type { Router } from "../framework/router";
import { prisma } from "../lib/db";
import { requireAuth } from "../middleware/auth.middleware";
import { resolveTenant } from "../middleware/tenant.middleware";
import { enrichContext } from "../middleware/enrich-context.middleware";

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
import { registerSettingsRoutes } from "../modules/settings/routes";

import { LocationsRepository } from "../modules/locations/repository";

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

  router.route("GET", "/api/v1/modules", [requireAuth, resolveTenant, enrichContext], async (context) => {
    const role = context.role ?? "";
    const permissions = context.permissions ?? [];

    const has = (p: string) => permissions.includes(p);

    // Role-specific module visibility
    const isCashier = role === "cashier" || role === "CASHIER";
    const isWarehouseManager = role === "warehouse_manager" || role === "WAREHOUSE_MANAGER";
    const isStoreManager = role === "store_manager" || role === "STORE_MANAGER";
    const isGlobal = context.isGlobalAccess ?? false;

    let dashboardVariant: string;
    let homeRoute: string;

    if (isGlobal) {
      dashboardVariant = role.includes("ops") || role.includes("OPS") ? "operations_manager" : "business_owner";
      homeRoute = "/dashboard";
    } else if (isStoreManager) {
      dashboardVariant = "store_manager";
      homeRoute = "/dashboard";
    } else if (isWarehouseManager) {
      dashboardVariant = "warehouse_manager";
      homeRoute = "/dashboard";
    } else if (isCashier) {
      dashboardVariant = "cashier";
      homeRoute = "/pos";
    } else {
      dashboardVariant = "business_owner";
      homeRoute = "/dashboard";
    }

    return {
      modules: {
        overview: !isCashier,
        inventory: has("INVENTORY_READ") || has("INVENTORY_WRITE") || isGlobal || isStoreManager || isWarehouseManager,
        warehouse: isGlobal || isWarehouseManager,
        pos: has("POS_SALES") || isCashier || isStoreManager || isGlobal,
        analytics: has("ANALYTICS_READ") || isGlobal || isStoreManager || isWarehouseManager,
        ai: has("AI_READ") || isGlobal,
        stores: isGlobal || isStoreManager || isWarehouseManager,
        settings: has("SETTINGS_MANAGE") || has("USER_MANAGEMENT") || isGlobal,
        dealers: has("SUPPLIER_MANAGEMENT") || has("PROCUREMENT_MANAGEMENT") || isGlobal,
        audit: has("AUDIT_READ") || isGlobal
      },
      dashboardVariant,
      homeRoute
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
  registerSettingsRoutes(router);
}