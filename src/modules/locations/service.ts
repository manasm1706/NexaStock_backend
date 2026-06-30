import { LocationsRepository } from "./repository";
import { toLocationDTO } from "./mapper";
import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";
import type { CreateLocationInput } from "./schema";

export class LocationsService {
  private readonly repository = new LocationsRepository();

  async getLocationsList(tenantId: string, locationIds?: string[]) {
    let locations = await this.repository.findLocations(tenantId);
    
    // Filter by assigned locations if user is location-scoped
    if (locationIds && locationIds.length > 0) {
      locations = locations.filter(loc => locationIds.includes(loc.id));
    }
    
    return locations.map(toLocationDTO);
  }

  async createLocation(input: CreateLocationInput, actorId: string, tenantId: string) {
    const { name, code, type, city, state, country } = input;
    const typeUpper = type.toUpperCase() as "STORE" | "WAREHOUSE" | "EXTERNAL_WAREHOUSE";

    const result = await prisma.$transaction(async () => {
      const location = await this.repository.createLocation({
        tenantId,
        name,
        code,
        type: typeUpper,
        city,
        state,
        country
      });

      if (typeUpper === "STORE") {
        await this.repository.createStoreDetail(location.id, location.code, tenantId);
      } else if (typeUpper === "WAREHOUSE") {
        await this.repository.createWarehouseDetail(location.id, location.code, tenantId);
      }

      return location;
    });

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId: actorId,
        module: "locations",
        action: "create",
        summary: `Created location ${name} (${code})`,
        entityType: "location",
        severity: "INFO"
      }
    });

    return toLocationDTO(result);
  }
}
