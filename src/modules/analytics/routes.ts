import type { Router } from "../../framework/router";
import { AnalyticsController } from "./controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";

export function registerAnalyticsRoutes(router: Router): void {
  const controller = new AnalyticsController();

  router.route("GET", "/api/v1/analytics/dashboard", [requireAuth, resolveTenant], controller.dashboard);
}
