import type { Router } from "../../framework/router";
import { TransfersController } from "./controller";
import { validateBody } from "../../middleware/validation.middleware";
import { createTransferSchema } from "./schema";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

export function registerTransfersRoutes(router: Router): void {
  const controller = new TransfersController();

  router.route("GET", "/api/v1/transfers", [requireAuth, resolveTenant], controller.list);
  router.route(
    "POST",
    "/api/v1/transfers",
    [requireAuth, resolveTenant, requirePermission("dispatchOperations"), validateBody(createTransferSchema)],
    controller.create
  );
}
