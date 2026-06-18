export interface ForecastItemDTO {
  productId: string;
  horizonDays: number;
  expectedDemand: number;
  confidence: number;
}

export interface AIRecommendationDTO {
  id: string;
  tag: string; // "Reorder" | "Redistribute" | "Promote" | "Pricing"
  title: string;

  body: string;
  confidence: number;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  reasoning: string;
  trend: "Increasing" | "Stable" | "Decreasing";
  entityId?: string;
  entityType?: string;
}

export interface DemandForecastDTO {
  entityType: "product" | "category";
  entityName: string;
  currentDemand: number;
  forecast7d: number;
  lowerBound7d: number;
  upperBound7d: number;
  forecast30d: number;
  lowerBound30d: number;
  upperBound30d: number;
  confidence: number;
  trend: "Increasing" | "Stable" | "Decreasing";
}

export interface AIAlertDTO {
  id: string;
  type: "low_stock" | "dead_stock" | "overstock" | "fast_moving";
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  trend: "Increasing" | "Stable" | "Decreasing";
}

export interface ReorderSuggestionDTO {
  productId: string;
  name: string;
  sku: string;
  currentStock: number;
  avgDailySales: number;
  daysRemaining: number;
  suggestedQty: number;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  confidence: number;
  reasoning: string;
  trend: "Increasing" | "Stable" | "Decreasing";
}

export interface AIInsightsDTO {
  executiveSummary: string;
  inventoryHealth: {
    score: number;
    stockoutsCount: number;
    deadStockCount: number;
    overstockCount: number;
    turnoverRatio: number;
    status: string;
  };
  recommendations: AIRecommendationDTO[];
  reorders: ReorderSuggestionDTO[];
  forecasts: DemandForecastDTO[];
  alerts: AIAlertDTO[];
  storePerformance: {
    bestStore: string;
    worstStore: string;
    insights: string[];
  };
  modelName: string;
  mape: string;
  coverage: string;
  latency: string;
}

export interface NaturalQueryResultDTO {
  answer: string;
  queryType: string;
  data?: any[];
}
