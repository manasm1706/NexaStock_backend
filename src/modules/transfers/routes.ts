import type { Router } from "../../framework/router";
import { TransfersController } from "./controller";
import { validateBody } from "../../middleware/validation.middleware";
import { createTransferSchema } from "./schema";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";
import { enrichContext } from "../../middleware/enrich-context.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

export function registerTransfersRoutes(router: Router): void {
  const controller = new TransfersController();

  router.route("GET", "/api/v1/transfers", [requireAuth, resolveTenant, enrichContext], controller.list);
  router.route(
    "POST",
    "/api/v1/transfers",
    [requireAuth, resolveTenant, enrichContext, requirePermission("dispatchOperations"), validateBody(createTransferSchema)],
    controller.create
  );
}
