import type { RequestContext } from "../../framework/types";
import { TenantService } from "./service";
import { permissionMatrix } from "../../domain/permissions";

export class TenantController {
  private readonly service = new TenantService();

  start = async (context: RequestContext) => {
    const body = context.body as any;
    return this.service.startOnboarding(body);
  };

  summary = async (context: RequestContext) => {
    const summary = await this.service.getSummary(context.tenantId);
    return {
      ...summary,
      permissions: permissionMatrix
    };
  };
}
