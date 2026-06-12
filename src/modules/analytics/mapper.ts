import type { AlertDTO } from "./dto";

export function toAlertDTO(alert: any): AlertDTO {
  return {
    id: alert.id,
    tenantId: alert.tenantId,
    severity: alert.severity.toLowerCase() as any,
    title: alert.title,
    message: alert.message,
    resolved: alert.status === "RESOLVED",
    createdAt: alert.createdAt.toISOString()
  };
}
