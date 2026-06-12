import type { RequestContext } from "../../framework/types";
import { ProcurementService } from "./service";

export class ProcurementController {
  private readonly service = new ProcurementService();

  list = async (context: RequestContext) => {
    return this.service.getSuppliersList(context.tenantId);
  };
}
