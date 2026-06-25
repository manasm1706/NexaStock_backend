import type { Router } from "../../framework/router";
import { UsersController } from "./controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";
import { requirePermission } from "../../middleware/permission.middleware";
import { rateLimit } from "../../middleware/rate-limit.middleware";

export function registerUsersRoutes(router: Router): void {
  const controller = new UsersController();

  router.route("GET", "/api/v1/users", [requireAuth, resolveTenant, requirePermission("userManagement")], controller.list);
  router.route("POST", "/api/v1/users/invite", [requireAuth, resolveTenant, requirePermission("userManagement"), rateLimit(30, 15 * 60 * 1000)], controller.invite);
  router.route("POST", "/api/v1/users/:id/resend-invite", [requireAuth, resolveTenant, requirePermission("userManagement")], controller.resendInvite);
  router.route("POST", "/api/v1/users/:id/cancel-invite", [requireAuth, resolveTenant, requirePermission("userManagement")], controller.cancelInvite);
  router.route("PUT", "/api/v1/users/:id/role", [requireAuth, resolveTenant, requirePermission("userManagement")], controller.updateRole);
  router.route("PUT", "/api/v1/users/:id/locations", [requireAuth, resolveTenant, requirePermission("userManagement")], controller.updateLocations);
  router.route("PUT", "/api/v1/users/:id/permissions", [requireAuth, resolveTenant, requirePermission("userManagement")], controller.updatePermissions);
  router.route("POST", "/api/v1/users/:id/deactivate", [requireAuth, resolveTenant, requirePermission("userManagement")], controller.deactivate);
  router.route("POST", "/api/v1/users/:id/reactivate", [requireAuth, resolveTenant, requirePermission("userManagement")], controller.reactivate);
  router.route("DELETE", "/api/v1/users/:id", [requireAuth, resolveTenant, requirePermission("userManagement")], controller.remove);
}
