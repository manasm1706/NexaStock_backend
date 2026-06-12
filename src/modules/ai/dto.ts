export interface ForecastItemDTO {
  productId: string;
  horizonDays: number;
  expectedDemand: number;
  confidence: number;
}

export interface AIInsightsDTO {
  forecasting: ForecastItemDTO[];
  recommendations: string[];
  anomalyScore: number;
}
