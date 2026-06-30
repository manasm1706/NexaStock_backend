import type { Router } from "../../framework/router";
import { SettingsController } from "./controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";
import { enrichContext } from "../../middleware/enrich-context.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

export function registerSettingsRoutes(router: Router): void {
  const controller = new SettingsController();

  router.route("GET", "/api/v1/roles", [requireAuth, resolveTenant, enrichContext, requirePermission("settingsManage")], controller.listRoles);
  router.route("POST", "/api/v1/roles", [requireAuth, resolveTenant, enrichContext, requirePermission("settingsManage")], controller.createRole);
  router.route("GET", "/api/v1/roles/:id/permissions", [requireAuth, resolveTenant, enrichContext, requirePermission("settingsManage")], controller.getPermissions);
  router.route("PUT", "/api/v1/roles/:id/permissions", [requireAuth, resolveTenant, enrichContext, requirePermission("settingsManage")], controller.savePermissions);
  router.route("POST", "/api/v1/roles/:id/clone", [requireAuth, resolveTenant, enrichContext, requirePermission("settingsManage")], controller.cloneRole);

  router.route("GET", "/api/v1/security/policy", [requireAuth, resolveTenant, enrichContext], controller.getPolicy);
  router.route("PUT", "/api/v1/security/policy", [requireAuth, resolveTenant, enrichContext, requirePermission("settingsManage")], controller.updatePolicy);

  router.route("GET", "/api/v1/security/sessions", [requireAuth, resolveTenant, enrichContext], controller.listSessions);
  router.route("POST", "/api/v1/security/sessions/revoke-others", [requireAuth, resolveTenant, enrichContext], controller.revokeOtherSessions);

  router.route("GET", "/api/v1/settings/notifications", [requireAuth, resolveTenant, enrichContext], controller.getNotifications);
  router.route("PUT", "/api/v1/settings/notifications", [requireAuth, resolveTenant, enrichContext], controller.updateNotifications);

  router.route("GET", "/api/v1/settings/workspace", [requireAuth, resolveTenant, enrichContext], controller.getWorkspaceSettings);
  router.route("PUT", "/api/v1/settings/workspace", [requireAuth, resolveTenant, enrichContext], controller.updateWorkspaceSettings);

  // Permission matrix management (Task 10)
  router.route("GET", "/api/v1/settings/permissions", [requireAuth, resolveTenant, enrichContext, requirePermission("settingsManage")], controller.getPermissionMatrix);
  router.route("PATCH", "/api/v1/settings/permissions/:roleId/:permissionId", [requireAuth, resolveTenant, enrichContext, requirePermission("settingsManage")], controller.togglePermission);
}

