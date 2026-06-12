import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";

export class TenantRepository {
  async createTenant(id: string, name: string, industry: string) {
    return prisma.tenant.create({
      data: {
        id,
        name,
        legalName: name,
        slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        status: "TRIAL",
        onboardingStatus: "completed",
        operationalModel: "HYBRID",
        industry,
        primaryCurrency: "USD"
      }
    });
  }

  async createTenantSettings(tenantId: string) {
    return prisma.tenantSettings.create({
      data: {
        id: createId("ts"),
        tenantId,
        operationalModel: "HYBRID"
      }
    });
  }

  async createDefaultRoles(tenantId: string) {
    const roleData = [
      { id: "role_" + createId("owner"), code: "business_owner", name: "Business Owner", key: "BUSINESS_OWNER" },
      { id: "role_" + createId("ops"), code: "operations_manager", name: "Operations Manager", key: "OPS_MANAGER" },
      { id: "role_" + createId("wh"), code: "warehouse_manager", name: "Warehouse Manager", key: "WAREHOUSE_MANAGER" },
      { id: "role_" + createId("store"), code: "store_manager", name: "Store Manager", key: "STORE_MANAGER" },
      { id: "role_" + createId("cashier"), code: "cashier", name: "Cashier", key: "CASHIER" }
    ];

    for (const r of roleData) {
      await prisma.role.create({
        data: {
          id: r.id,
          tenantId,
          roleKey: r.key as any,
          code: r.code,
          name: r.name,
          isSystem: true
        }
      });
    }
  }

  async findTenantById(id: string) {
    return prisma.tenant.findUnique({
      where: { id }
    });
  }

  async getCounts(tenantId: string) {
    const [usersCount, locationsCount, productsCount] = await Promise.all([
      prisma.user.count({ where: { tenantId } }),
      prisma.location.count({ where: { tenantId } }),
      prisma.product.count({ where: { tenantId } })
    ]);
    return { usersCount, locationsCount, productsCount };
  }
}
