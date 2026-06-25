import type { RequestContext } from "../../framework/types";
import { TransfersService } from "./service";

export class TransfersController {
  private readonly service = new TransfersService();

  list = async (context: RequestContext) => {
    return this.service.getTransfersList(context.tenantId, context.actorId, context.role);
  };

  create = async (context: RequestContext) => {
    const actorId = context.actorId!;
    return this.service.createTransferRequest(context.body as any, actorId, context.role!, context.tenantId);
  };
}
