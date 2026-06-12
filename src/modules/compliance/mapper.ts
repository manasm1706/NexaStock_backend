import type { AuditEventDTO } from "./dto";

export function toAuditEventDTO(log: any): AuditEventDTO {
  return {
    id: log.id,
    tenantId: log.tenantId,
    actorId: log.actorUserId || undefined,
    module: log.module,
    action: log.action,
    summary: log.summary,
    createdAt: log.createdAt.toISOString()
  };
}
