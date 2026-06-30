import type { RequestContext } from "../../framework/types";
import { LocationsService } from "./service";

export class LocationsController {
  private readonly service = new LocationsService();

  list = async (context: RequestContext) => {
    const locationIds = context.isGlobalAccess ? undefined : context.assignedLocationIds;
    return this.service.getLocationsList(context.tenantId, locationIds);
  };

  create = async (context: RequestContext) => {
    const actorId = context.actorId!;
    return this.service.createLocation(context.body as any, actorId, context.tenantId);
  };
}
