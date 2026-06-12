import type { Router } from "../../framework/router";
import { POSController } from "./controller";
import { validateBody } from "../../middleware/validation.middleware";
import { createPOSInvoiceSchema } from "./schema";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

export function registerPOSRoutes(router: Router): void {
  const controller = new POSController();

  router.route("GET", "/api/v1/pos/summary", [requireAuth, resolveTenant], controller.summary);
  router.route(
    "POST",
    "/api/v1/pos/invoices",
    [requireAuth, resolveTenant, requirePermission("posSales"), validateBody(createPOSInvoiceSchema)],
    controller.createInvoice
  );
}
