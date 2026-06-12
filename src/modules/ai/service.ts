import { AIRepository } from "./repository";
import type { AIInsightsDTO } from "./dto";
import { toForecastItemDTO } from "./mapper";

export class AIService {
  private readonly repository = new AIRepository();

  async getInsights(tenantId: string): Promise<AIInsightsDTO> {
    const [forecasts, recommendations] = await Promise.all([
      this.repository.getForecastRecords(tenantId),
      this.repository.getRecommendations(tenantId)
    ]);

    return {
      forecasting: forecasts.map(toForecastItemDTO),
      recommendations: recommendations.map((r) => r.description || r.title),
      anomalyScore: 0.17
    };
  }
}
