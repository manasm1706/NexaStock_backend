import type { ForecastItemDTO } from "./dto";

export function toForecastItemDTO(f: any): ForecastItemDTO {
  return {
    productId: f.entityId,
    horizonDays: f.horizonDays,
    expectedDemand: Number(f.predictedValue),
    confidence: f.confidence
  };
}
