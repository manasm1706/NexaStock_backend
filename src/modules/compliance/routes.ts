import type { Router } from "../../framework/router";
import { ComplianceController } from "./controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";
import { enrichContext } from "../../middleware/enrich-context.middleware";

export function registerComplianceRoutes(router: Router): void {
  const controller = new ComplianceController();

  router.route("GET", "/api/v1/audit/events", [requireAuth, resolveTenant, enrichContext], controller.auditLogs);
}
