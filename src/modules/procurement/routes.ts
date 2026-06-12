import type { Router } from "../../framework/router";
import { ProcurementController } from "./controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";

export function registerProcurementRoutes(router: Router): void {
  const controller = new ProcurementController();

  router.route("GET", "/api/v1/suppliers", [requireAuth, resolveTenant], controller.list);
}
