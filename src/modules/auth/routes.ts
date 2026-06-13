import type { Router } from "../../framework/router";
import { AuthController } from "./controller";
import { validateBody } from "../../middleware/validation.middleware";
import { loginSchema } from "./schema";
import { onboardingSchema } from "../tenant/schema";
import { requireAuth } from "../../middleware/auth.middleware";

export function registerAuthRoutes(router: Router): void {
  const controller = new AuthController();

  router.route("POST", "/api/v1/auth/login", [validateBody(loginSchema)], controller.login);
  router.route("POST", "/api/v1/auth/register", [validateBody(onboardingSchema)], controller.register);
  router.route("POST", "/api/v1/auth/logout", [requireAuth], controller.logout);
  router.route("GET", "/api/v1/auth/me", [requireAuth], controller.profile);
  router.route("GET", "/api/v1/settings/profile", [requireAuth], controller.profile);
}
