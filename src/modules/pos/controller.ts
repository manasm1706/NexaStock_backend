import type { RequestContext } from "../../framework/types";
import { POSService } from "./service";

export class POSController {
  private readonly service = new POSService();

  summary = async (context: RequestContext) => {
    const locationIds = context.isGlobalAccess ? undefined : context.assignedLocationIds;
    return this.service.getSummary(context.tenantId, locationIds);
  };

  createInvoice = async (context: RequestContext) => {
    const actorId = context.actorId!;
    const locationIds = context.isGlobalAccess ? undefined : context.assignedLocationIds;
    return this.service.checkout(context.body as any, actorId, context.role!, context.tenantId, locationIds);
  };
}
