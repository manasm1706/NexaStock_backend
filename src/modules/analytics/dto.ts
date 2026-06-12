export interface TopProductDTO {
  productId: string;
  name: string;
  units: number;
  revenue: number;
}

export interface AlertDTO {
  id: string;
  tenantId: string;
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  resolved: boolean;
  createdAt: string;
}

export interface AnalyticsDashboardDTO {
  revenue: number;
  grossMargin: number;
  inventoryValue: number;
  lowStockAlerts: number;
  pendingTransfers: number;
  topProducts: TopProductDTO[];
  alerts: AlertDTO[];
}
