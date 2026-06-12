import type { Router } from "../../framework/router";
import { AIController } from "./controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";

export function registerAIRoutes(router: Router): void {
  const controller = new AIController();

  router.route("GET", "/api/v1/ai/insights", [requireAuth, resolveTenant], controller.insights);
}
