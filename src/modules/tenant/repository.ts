import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";

export class TenantRepository {
  async createTenant(data: {
    id: string;
    name: string;
    legalName?: string;
    industry: string;
    primaryCurrency?: string;
    timezone?: string;
  }) {
    const baseSlug = (data.legalName || data.name).toLowerCase().replace(/[^a-z0-9]/g, "-");
    const uniqueSlug = `${baseSlug || "tenant"}-${data.id.substring(data.id.length - 6)}`;
    return prisma.tenant.create({
      data: {
        id: data.id,
        name: data.name,
        legalName: data.legalName || data.name,
        slug: uniqueSlug,
        status: "ACTIVE",
        onboardingStatus: "completed",
        operationalModel: "HYBRID",
        industry: data.industry,
        primaryCurrency: data.primaryCurrency || "INR",
        timezone: data.timezone || "UTC"
      }
    });
  }

  async createTenantSettings(data: {
    tenantId: string;
    currencyCode?: string;
    timezone?: string;
    aiPreference?: string;
  }) {
    return prisma.tenantSettings.create({
      data: {
        id: createId("ts"),
        tenantId: data.tenantId,
        operationalModel: "HYBRID",
        currencyCode: data.currencyCode || "INR",
        timezone: data.timezone || "UTC",
        aiPreferences: data.aiPreference ? { defaultAutonomy: data.aiPreference } : {}
      }
    });
  }

  async createDefaultRoles(tenantId: string) {
    const ownerRoleId = "role_" + createId("owner");
    const roleData = [
      { id: ownerRoleId, code: "business_owner", name: "Business Owner", key: "BUSINESS_OWNER" },
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

    return { ownerRoleId };
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
