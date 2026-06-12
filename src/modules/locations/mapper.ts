import type { LocationDTO } from "./dto";

export function toLocationDTO(loc: any): LocationDTO {
  return {
    id: loc.id,
    tenantId: loc.tenantId,
    name: loc.name,
    code: loc.code,
    type: loc.locationType.toLowerCase() as any,
    city: loc.city || "",
    state: loc.state || "",
    country: loc.country || "",
    healthScore: 90,
    staffCount: loc.locationType === "STORE" ? 5 : 12
  };
}
