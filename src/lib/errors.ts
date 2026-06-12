export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details: unknown = null
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details: unknown = null) {
    super(400, "VALIDATION_ERROR", message, details);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, code = "BAD_REQUEST", details: unknown = null) {
    super(400, code, message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Authentication required", details: unknown = null) {
    super(401, "UNAUTHORIZED", message, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Access denied", details: unknown = null) {
    super(403, "FORBIDDEN", message, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", details: unknown = null) {
    super(404, "NOT_FOUND", message, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details: unknown = null) {
    super(409, "CONFLICT", message, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error", details: unknown = null) {
    super(500, "INTERNAL_SERVER_ERROR", message, details);
  }
}
