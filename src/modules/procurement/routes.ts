import type { Router } from "../../framework/router";
import { ProcurementController } from "./controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";
import { enrichContext } from "../../middleware/enrich-context.middleware";

export function registerProcurementRoutes(router: Router): void {
  const controller = new ProcurementController();

  router.route("GET", "/api/v1/suppliers", [requireAuth, resolveTenant, enrichContext], controller.list);
  router.route("POST", "/api/v1/suppliers", [requireAuth, resolveTenant, enrichContext], controller.create);
  router.route("PUT", "/api/v1/suppliers/:id", [requireAuth, resolveTenant, enrichContext], controller.update);
  router.route("PUT", "/api/v1/suppliers/:id/products", [requireAuth, resolveTenant, enrichContext], controller.setProducts);
  router.route("DELETE", "/api/v1/suppliers/:id", [requireAuth, resolveTenant, enrichContext], controller.delete);
  router.route("POST", "/api/v1/suppliers/:id/send-order", [requireAuth, resolveTenant, enrichContext], controller.sendOrder);
}
