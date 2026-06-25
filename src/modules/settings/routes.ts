import type { Router } from "../../framework/router";
import { SettingsController } from "./controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

export function registerSettingsRoutes(router: Router): void {
  const controller = new SettingsController();

  // Roles & permissions (guarded by settingsManage)
  router.route("GET", "/api/v1/roles", [requireAuth, resolveTenant, requirePermission("settingsManage")], controller.listRoles);
  router.route("POST", "/api/v1/roles", [requireAuth, resolveTenant, requirePermission("settingsManage")], controller.createRole);
  router.route("GET", "/api/v1/roles/:id/permissions", [requireAuth, resolveTenant, requirePermission("settingsManage")], controller.getPermissions);
  router.route("PUT", "/api/v1/roles/:id/permissions", [requireAuth, resolveTenant, requirePermission("settingsManage")], controller.savePermissions);
  router.route("POST", "/api/v1/roles/:id/clone", [requireAuth, resolveTenant, requirePermission("settingsManage")], controller.cloneRole);

  // Security policy (guarded by settingsManage)
  router.route("GET", "/api/v1/security/policy", [requireAuth, resolveTenant], controller.getPolicy);
  router.route("PUT", "/api/v1/security/policy", [requireAuth, resolveTenant, requirePermission("settingsManage")], controller.updatePolicy);

  // User sessions (user-specific, requireAuth only)
  router.route("GET", "/api/v1/security/sessions", [requireAuth, resolveTenant], controller.listSessions);
  router.route("POST", "/api/v1/security/sessions/revoke-others", [requireAuth, resolveTenant], controller.revokeOtherSessions);

  // Notification preferences (user-specific, requireAuth only)
  router.route("GET", "/api/v1/settings/notifications", [requireAuth, resolveTenant], controller.getNotifications);
  router.route("PUT", "/api/v1/settings/notifications", [requireAuth, resolveTenant], controller.updateNotifications);

  // Workspace customization settings
  router.route("GET", "/api/v1/settings/workspace", [requireAuth, resolveTenant], controller.getWorkspaceSettings);
  router.route("PUT", "/api/v1/settings/workspace", [requireAuth, resolveTenant], controller.updateWorkspaceSettings);
}

