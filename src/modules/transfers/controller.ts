import type { RequestContext } from "../../framework/types";
import { TransfersService } from "./service";

export class TransfersController {
  private readonly service = new TransfersService();

  list = async (context: RequestContext) => {
    const locationIds = context.isGlobalAccess ? undefined : context.assignedLocationIds;
    return this.service.getTransfersList(context.tenantId, locationIds);
  };

  create = async (context: RequestContext) => {
    const actorId = context.actorId!;
    const locationIds = context.isGlobalAccess ? undefined : context.assignedLocationIds;
    return this.service.createTransferRequest(context.body as any, actorId, context.role!, context.tenantId, locationIds);
  };
}
