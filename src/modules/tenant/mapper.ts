import type { TenantDTO } from "./dto";

export function toTenantDTO(tenant: any, plan = "professional"): TenantDTO {
  return {
    id: tenant.id,
    name: tenant.name,
    legalName: tenant.legalName,
    industry: tenant.industry,
    status: tenant.status.toLowerCase(),
    plan,
    createdAt: tenant.createdAt.toISOString()
  };
}
