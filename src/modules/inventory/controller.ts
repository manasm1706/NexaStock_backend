import type { RequestContext } from "../../framework/types";
import { InventoryService } from "./service";

export class InventoryController {
  private readonly service = new InventoryService();

  balances = async (context: RequestContext) => {
    const locationIds = context.isGlobalAccess ? undefined : context.assignedLocationIds;
    return this.service.getBalances(context.tenantId, locationIds);
  };

  movements = async (context: RequestContext) => {
    const locationIds = context.isGlobalAccess ? undefined : context.assignedLocationIds;
    return this.service.getMovements(context.tenantId, locationIds);
  };

  adjust = async (context: RequestContext) => {
    const actorId = context.actorId!;
    const locationIds = context.isGlobalAccess ? undefined : context.assignedLocationIds;
    return this.service.adjustInventory(context.body as any, actorId, context.role!, context.tenantId, locationIds);
  };

  import = async (context: RequestContext) => {
    const actorId = context.actorId!;
    const locationIds = context.isGlobalAccess ? undefined : context.assignedLocationIds;
    return this.service.bulkImportInventory(context.body as any, actorId, context.role!, context.tenantId, locationIds);
  };
}
