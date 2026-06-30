import type { RequestContext } from "../../framework/types";
import { AnalyticsService } from "./service";

export class AnalyticsController {
  private readonly service = new AnalyticsService();

  dashboard = async (context: RequestContext) => {
    const startDate = context.query.get("startDate") || undefined;
    const endDate = context.query.get("endDate") || undefined;
    const locationIds = context.isGlobalAccess ? undefined : context.assignedLocationIds;
    return this.service.getDashboardData(context.tenantId, startDate, endDate, locationIds);
  };

  exportReport = async (context: RequestContext) => {
    const reportType = context.query.get("reportType") || "revenue";
    const csvContent = await this.service.generateCSVReport(reportType, context.tenantId);

    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `${reportType}_report_${dateStr}.csv`;

    context.response.writeHead(200, {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Pragma": "no-cache",
      "Expires": "0",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    });
    
    context.response.end(csvContent);
  };
}
