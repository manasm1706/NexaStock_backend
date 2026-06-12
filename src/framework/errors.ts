export class HttpError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function badRequest(message: string, details?: unknown): HttpError {
  return new HttpError(400, "BAD_REQUEST", message, details);
}

export function unauthorized(message = "Unauthorized"): HttpError {
  return new HttpError(401, "UNAUTHORIZED", message);
}

export function forbidden(message = "Forbidden"): HttpError {
  return new HttpError(403, "FORBIDDEN", message);
}

export function notFound(message = "Not found"): HttpError {
  return new HttpError(404, "NOT_FOUND", message);
}

export function conflict(message: string, details?: unknown): HttpError {
  return new HttpError(409, "CONFLICT", message, details);
}
