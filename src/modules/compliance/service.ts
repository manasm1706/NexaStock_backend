import { ComplianceRepository } from "./repository";
import { toAuditEventDTO } from "./mapper";

export class ComplianceService {
  private readonly repository = new ComplianceRepository();

  async getAuditEvents(tenantId: string, role?: string) {
    const logs = await this.repository.getAuditLogs(tenantId);
    const events = logs.map(toAuditEventDTO);
    
    if (role === "cashier") {
      return events.slice(0, 10);
    }
    return events;
  }
}
