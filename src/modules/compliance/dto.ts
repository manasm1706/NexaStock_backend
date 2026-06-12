export interface AuditEventDTO {
  id: string;
  tenantId: string;
  actorId?: string;
  module: string;
  action: string;
  summary: string;
  createdAt: string;
}
