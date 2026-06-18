import type { Router } from "../../framework/router";
import { InventoryController } from "./controller";
import { validateBody } from "../../middleware/validation.middleware";
import { adjustInventorySchema, importInventorySchema } from "./schema";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

export function registerInventoryRoutes(router: Router): void {
  const controller = new InventoryController();

  router.route("GET", "/api/v1/inventory/balances", [requireAuth, resolveTenant], controller.balances);
  router.route("GET", "/api/v1/inventory/movements", [requireAuth, resolveTenant], controller.movements);
  router.route(
    "POST",
    "/api/v1/inventory/adjustments",
    [requireAuth, resolveTenant, requirePermission("inventoryAdjustments"), validateBody(adjustInventorySchema)],
    controller.adjust
  );
  router.route(
    "POST",
    "/api/v1/inventory/import",
    [requireAuth, resolveTenant, requirePermission("inventoryAdjustments"), validateBody(importInventorySchema)],
    controller.import
  );
}
