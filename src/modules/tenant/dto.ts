export interface TenantDTO {
  id: string;
  name: string;
  legalName: string;
  industry: string;
  status: string;
  plan: string;
  createdAt: string;
}

export interface TenantSummaryResponseDTO {
  tenant: TenantDTO;
  users: number;
  locations: number;
  products: number;
  permissions: Record<string, any>;
}
