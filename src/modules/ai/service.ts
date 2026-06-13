import { AIRepository } from "./repository";
import type { AIInsightsDTO } from "./dto";
import { toForecastItemDTO } from "./mapper";

export class AIService {
  private readonly repository = new AIRepository();

  async getInsights(tenantId: string): Promise<AIInsightsDTO> {
    const [forecasts, recommendations, anomalies] = await Promise.all([
      this.repository.getForecastRecords(tenantId),
      this.repository.getRecommendations(tenantId),
      this.repository.getAnomalies(tenantId)
    ]);

    const anomalyScore = anomalies.length > 0
      ? (anomalies.reduce((sum, a) => sum + a.score, 0) / anomalies.length)
      : 0.0;

    return {
      forecasting: forecasts.map(toForecastItemDTO),
      recommendations: recommendations.map((r) => r.description || r.title),
      anomalyScore
    };
  }
}
