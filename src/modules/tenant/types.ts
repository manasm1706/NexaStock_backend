export interface TenantConfig {
  operationalModel: "HYBRID" | "CENTRALIZED" | "DISTRIBUTED";
  primaryCurrency: string;
  timezone: string;
}
