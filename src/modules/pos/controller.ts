import type { RequestContext } from "../../framework/types";
import { POSService } from "./service";

export class POSController {
  private readonly service = new POSService();

  summary = async (context: RequestContext) => {
    return this.service.getSummary(context.tenantId, context.actorId, context.role);
  };

  createInvoice = async (context: RequestContext) => {
    const actorId = context.actorId!;
    return this.service.checkout(context.body as any, actorId, context.role!, context.tenantId);
  };
}
