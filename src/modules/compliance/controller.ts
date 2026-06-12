import type { RequestContext } from "../../framework/types";
import { ComplianceService } from "./service";

export class ComplianceController {
  private readonly service = new ComplianceService();

  auditLogs = async (context: RequestContext) => {
    return this.service.getAuditEvents(context.tenantId, context.role);
  };
}
