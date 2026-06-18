import type { Router } from "../../framework/router";
import { AuthController } from "./controller";
import { validateBody } from "../../middleware/validation.middleware";
import { loginSchema } from "./schema";
import { onboardingSchema } from "../tenant/schema";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";

export function registerAuthRoutes(router: Router): void {
  const controller = new AuthController();

  router.route("POST", "/api/v1/auth/login", [validateBody(loginSchema)], controller.login);
  router.route("POST", "/api/v1/auth/register", [validateBody(onboardingSchema)], controller.register);
  router.route("POST", "/api/v1/auth/logout", [requireAuth], controller.logout);
  router.route("GET", "/api/v1/auth/me", [requireAuth], controller.profile);
  
  // Profile settings
  router.route("GET", "/api/v1/settings/profile", [requireAuth], controller.profile);
  router.route("PUT", "/api/v1/settings/profile", [requireAuth, resolveTenant], controller.updateProfile);
  router.route("PUT", "/api/v1/settings/password", [requireAuth, resolveTenant], controller.updatePassword);

  // Public Invitation acceptance endpoints
  router.route("GET", "/api/v1/auth/invitation/:token", [], controller.getInvitation);
  router.route("POST", "/api/v1/auth/invitation/accept", [], controller.acceptInvitation);
}
