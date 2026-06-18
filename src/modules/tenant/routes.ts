import type { Router } from "../../framework/router";
import { TenantController } from "./controller";
import { validateBody } from "../../middleware/validation.middleware";
import { onboardingSchema } from "./schema";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

export function registerTenantRoutes(router: Router): void {
  const controller = new TenantController();

  router.route("POST", "/api/v1/onboarding/start", [validateBody(onboardingSchema)], controller.start);
  router.route("GET", "/api/v1/tenants/current", [requireAuth, resolveTenant], controller.summary);
  router.route("PUT", "/api/v1/tenants/current", [requireAuth, resolveTenant, requirePermission("settingsManage")], controller.update);
}
