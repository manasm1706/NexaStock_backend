import { badRequest } from "../framework/errors";

export function asString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw badRequest(`${fieldName} must be a non-empty string`);
  }

  return value.trim();
}

export function asNumber(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw badRequest(`${fieldName} must be a valid number`);
  }

  return value;
}

export function asOptionalString(value: unknown): string | undefined {
  if (typeof value === "undefined" || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw badRequest("Optional string value must be a string");
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function asStringArray(value: unknown, fieldName: string): string[] {
  if (!Array.isArray(value)) {
    throw badRequest(`${fieldName} must be an array of strings`);
  }

  const cleaned = value.map((entry) => asString(entry, fieldName));
  return cleaned;
}
