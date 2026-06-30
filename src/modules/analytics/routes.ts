import type { Router } from "../../framework/router";
import { AnalyticsController } from "./controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";
import { enrichContext } from "../../middleware/enrich-context.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

export function registerAnalyticsRoutes(router: Router): void {
  const controller = new AnalyticsController();

  router.route("GET", "/api/v1/analytics/dashboard", [requireAuth, resolveTenant, enrichContext, requirePermission("analyticsRead")], controller.dashboard);
  router.route("GET", "/api/v1/analytics/export", [requireAuth, resolveTenant, enrichContext, requirePermission("analyticsRead")], controller.exportReport);
}

