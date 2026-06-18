import type { Router } from "../../framework/router";
import { UsersController } from "./controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

export function registerUsersRoutes(router: Router): void {
  const controller = new UsersController();

  router.route("GET", "/api/v1/users", [requireAuth, resolveTenant, requirePermission("userManagement")], controller.list);
  router.route("POST", "/api/v1/users/invite", [requireAuth, resolveTenant, requirePermission("userManagement")], controller.invite);
  router.route("POST", "/api/v1/users/:id/resend-invite", [requireAuth, resolveTenant, requirePermission("userManagement")], controller.resendInvite);
  router.route("POST", "/api/v1/users/:id/cancel-invite", [requireAuth, resolveTenant, requirePermission("userManagement")], controller.cancelInvite);
  router.route("PUT", "/api/v1/users/:id/role", [requireAuth, resolveTenant, requirePermission("userManagement")], controller.updateRole);
  router.route("POST", "/api/v1/users/:id/deactivate", [requireAuth, resolveTenant, requirePermission("userManagement")], controller.deactivate);
  router.route("POST", "/api/v1/users/:id/reactivate", [requireAuth, resolveTenant, requirePermission("userManagement")], controller.reactivate);
  router.route("DELETE", "/api/v1/users/:id", [requireAuth, resolveTenant, requirePermission("userManagement")], controller.remove);
}
