import type { RequestContext } from "../../framework/types";
import { AIService } from "./service";

export class AIController {
  private readonly service = new AIService();

  insights = async (context: RequestContext) => {
    return this.service.getInsights(context.tenantId, context.actorId, context.role);
  };

  query = async (context: RequestContext) => {
    const { query: queryStr } = (context.body as { query?: string }) || {};
    if (!queryStr) {
      return {
        answer: "Please ask a question to query NexaStock business intelligence.",
        queryType: "unsupported"
      };
    }
    return this.service.executeNaturalQuery(queryStr, context.tenantId);
  };
}
