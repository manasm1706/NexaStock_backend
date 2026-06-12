import type { RequestContext } from "../../framework/types";
import { AIService } from "./service";

export class AIController {
  private readonly service = new AIService();

  insights = async (context: RequestContext) => {
    return this.service.getInsights(context.tenantId);
  };
}
