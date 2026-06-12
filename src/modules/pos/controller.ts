import type { RequestContext } from "../../framework/types";
import { POSService } from "./service";

export class POSController {
  private readonly service = new POSService();

  summary = async (context: RequestContext) => {
    return this.service.getSummary(context.tenantId);
  };

  createInvoice = async (context: RequestContext) => {
    const actorId = context.actorId!;
    return this.service.checkout(context.body as any, actorId, context.tenantId);
  };
}
