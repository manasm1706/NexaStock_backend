export interface LocationDTO {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  type: "warehouse" | "store" | "external_warehouse";
  city: string;
  state: string;
  country: string;
  healthScore: number;
  staffCount: number;
}
