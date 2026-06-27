import type { RequestContext } from "../../framework/types";
import { ProcurementService } from "./service";

export class ProcurementController {
  private readonly service = new ProcurementService();

  list = async (context: RequestContext) => {
    return this.service.getSuppliersList(context.tenantId);
  };

  create = async (context: RequestContext) => {
    return this.service.createSupplier(context.tenantId, context.body as any);
  };

  update = async (context: RequestContext) => {
    return this.service.updateSupplier(context.tenantId, context.params.id!, context.body as any);
  };

  delete = async (context: RequestContext) => {
    return this.service.deleteSupplier(context.tenantId, context.params.id!);
  };

  setProducts = async (context: RequestContext) => {
    return this.service.setSupplierProducts(context.tenantId, context.params.id!, context.body as any);
  };

  sendOrder = async (context: RequestContext) => {
    return this.service.sendSupplierOrder(
      context.tenantId,
      context.params.id!,
      context.body as any,
      context.actorId
    );
  };
}
