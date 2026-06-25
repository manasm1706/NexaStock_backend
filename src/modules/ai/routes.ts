import type { Router } from "../../framework/router";
import { AIController } from "./controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

export function registerAIRoutes(router: Router): void {
  const controller = new AIController();

  router.route("GET", "/api/v1/ai/insights", [requireAuth, resolveTenant, requirePermission("aiRead")], controller.insights);
  router.route("POST", "/api/v1/ai/query", [requireAuth, resolveTenant, requirePermission("aiRead")], controller.query);
}

