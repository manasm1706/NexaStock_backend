import { TenantRepository } from "./repository";
import { createId } from "../../lib/crypto";
import { toTenantDTO } from "./mapper";
import { NotFoundError } from "../../lib/errors";
import { prisma } from "../../lib/db";

export class TenantService {
  private readonly repository = new TenantRepository();

  async startOnboarding(organizationName: string, industry: string, plan: string) {
    const tenantId = createId("tenant");
    
    // Use transactional boundaries to enforce rollback on creation failure
    const tenant = await prisma.$transaction(async () => {
      const created = await this.repository.createTenant(tenantId, organizationName, industry);
      await this.repository.createTenantSettings(tenantId);
      await this.repository.createDefaultRoles(tenantId);
      return created;
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        module: "onboarding",
        action: "tenant_created",
        summary: `Tenant ${organizationName} created`,
        entityType: "tenant",
        severity: "INFO"
      }
    });

    return toTenantDTO(tenant, plan);
  }

  async getSummary(tenantId: string) {
    const tenant = await this.repository.findTenantById(tenantId);
    if (!tenant) {
      throw new NotFoundError(`Tenant with ID ${tenantId} not found`);
    }

    const { usersCount, locationsCount, productsCount } = await this.repository.getCounts(tenantId);
    
    return {
      tenant: toTenantDTO(tenant),
      users: usersCount,
      locations: locationsCount,
      products: productsCount
    };
  }
}
