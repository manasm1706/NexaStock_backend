import type { Router } from "../../framework/router";
import { ProcurementController } from "./controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";

export function registerProcurementRoutes(router: Router): void {
  const controller = new ProcurementController();

  router.route("GET", "/api/v1/suppliers", [requireAuth, resolveTenant], controller.list);
  router.route("POST", "/api/v1/suppliers", [requireAuth, resolveTenant], controller.create);
  router.route("PUT", "/api/v1/suppliers/:id", [requireAuth, resolveTenant], controller.update);
  router.route("PUT", "/api/v1/suppliers/:id/products", [requireAuth, resolveTenant], controller.setProducts);
  router.route("DELETE", "/api/v1/suppliers/:id", [requireAuth, resolveTenant], controller.delete);
  router.route("POST", "/api/v1/suppliers/:id/send-order", [requireAuth, resolveTenant], controller.sendOrder);
}
