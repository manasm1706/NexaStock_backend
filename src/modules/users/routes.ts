import type { Router } from "../../framework/router";
import { UsersController } from "./controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";

export function registerUsersRoutes(router: Router): void {
  const controller = new UsersController();

  router.route("GET", "/api/v1/users", [requireAuth, resolveTenant], controller.list);
}
