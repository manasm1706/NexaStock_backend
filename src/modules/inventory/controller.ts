import type { RequestContext } from "../../framework/types";
import { InventoryService } from "./service";

export class InventoryController {
  private readonly service = new InventoryService();

  balances = async (context: RequestContext) => {
    return this.service.getBalances(context.tenantId, context.actorId, context.role);
  };

  movements = async (context: RequestContext) => {
    return this.service.getMovements(context.tenantId, context.actorId, context.role);
  };

  adjust = async (context: RequestContext) => {
    const actorId = context.actorId!;
    return this.service.adjustInventory(context.body as any, actorId, context.role!, context.tenantId);
  };

  import = async (context: RequestContext) => {
    const actorId = context.actorId!;
    return this.service.bulkImportInventory(context.body as any, actorId, context.role!, context.tenantId);
  };
}
