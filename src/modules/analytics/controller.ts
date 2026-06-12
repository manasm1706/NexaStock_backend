import type { RequestContext } from "../../framework/types";
import { AnalyticsService } from "./service";

export class AnalyticsController {
  private readonly service = new AnalyticsService();

  dashboard = async (context: RequestContext) => {
    return this.service.getDashboardData(context.tenantId);
  };
}
