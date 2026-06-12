import type { Router } from "../../framework/router";
import { LocationsController } from "./controller";
import { validateBody } from "../../middleware/validation.middleware";
import { createLocationSchema } from "./schema";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";

export function registerLocationsRoutes(router: Router): void {
  const controller = new LocationsController();

  router.route("GET", "/api/v1/locations", [requireAuth, resolveTenant], controller.list);
  router.route("POST", "/api/v1/locations", [requireAuth, resolveTenant, validateBody(createLocationSchema)], controller.create);
}
