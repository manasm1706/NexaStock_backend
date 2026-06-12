export interface SupplierDTO {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  contactName: string;
  phone: string;
  email: string;
  taxId?: string;
  status: "active" | "paused";
  performanceScore: number;
}
