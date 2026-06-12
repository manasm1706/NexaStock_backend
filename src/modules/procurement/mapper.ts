import type { SupplierDTO } from "./dto";

export function toSupplierDTO(sup: any): SupplierDTO {
  const contact = sup.contacts?.[0];
  return {
    id: sup.id,
    tenantId: sup.tenantId,
    name: sup.name,
    code: sup.supplierCode,
    contactName: contact?.name || "",
    phone: contact?.phone || "",
    email: contact?.email || "",
    taxId: sup.gstNumber || undefined,
    status: sup.status.toLowerCase() as "active" | "paused",
    performanceScore: Number(sup.performanceScore || 100)
  };
}
