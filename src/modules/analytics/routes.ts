import type { Router } from "../../framework/router";
import { AnalyticsController } from "./controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

export function registerAnalyticsRoutes(router: Router): void {
  const controller = new AnalyticsController();

  router.route("GET", "/api/v1/analytics/dashboard", [requireAuth, resolveTenant, requirePermission("analyticsRead")], controller.dashboard);
  router.route("GET", "/api/v1/analytics/export", [requireAuth, resolveTenant, requirePermission("analyticsRead")], controller.exportReport);
}

