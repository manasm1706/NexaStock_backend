import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";

export class LocationsRepository {
  async findLocations(tenantId: string) {
    return prisma.location.findMany({
      where: { tenantId }
    });
  }

  async createLocation(data: {
    tenantId: string;
    name: string;
    code: string;
    type: "STORE" | "WAREHOUSE" | "EXTERNAL_WAREHOUSE";
    city: string;
    state: string;
    country: string;
  }) {
    return prisma.location.create({
      data: {
        id: createId("loc"),
        tenantId: data.tenantId,
        name: data.name,
        code: data.code,
        locationType: data.type,
        city: data.city,
        state: data.state,
        country: data.country,
        status: "ACTIVE"
      }
    });
  }

  async createStoreDetail(locationId: string, storeCode: string, tenantId: string) {
    return prisma.store.create({
      data: {
        id: createId("st"),
        tenantId,
        locationId,
        storeCode
      }
    });
  }

  async createWarehouseDetail(locationId: string, warehouseCode: string, tenantId: string) {
    return prisma.warehouse.create({
      data: {
        id: createId("wh"),
        tenantId,
        locationId,
        warehouseCode
      }
    });
  }
}
