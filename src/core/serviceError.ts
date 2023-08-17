const NOT_FOUND = "NOT_FOUND";
const UNAUTHORIZED = "UNAUTHORIZED";
const FORBIDDEN = "FORBIDDEN";
const VALIDATION_FAILED = "VALIDATION_FAILED";
const BAD_REQUEST = "BAD_REQUEST";

class ServiceError extends Error {
  code: string;
  details: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "ServiceError";
  }

  get isNotFound() {
    return this.code === NOT_FOUND;
  }

  get isUnauthorized() {
    return this.code === UNAUTHORIZED;
  }

  get isForbidden() {
    return this.code === FORBIDDEN;
  }

  get isValidationFailed() {
    return this.code === VALIDATION_FAILED;
  }

  get isBadRequest() {
    return this.code === BAD_REQUEST;
  }

  static notFound(message: string, details?: any) {
    return new ServiceError(message, NOT_FOUND, details);
  }

  static unauthorized(message: string, details?: any) {
    return new ServiceError(message, UNAUTHORIZED, details);
  }

  static forbidden(message: string, details?: any) {
    return new ServiceError(message, FORBIDDEN, details);
  }

  static validationFailed(message: string, details?: any) {
    return new ServiceError(message, VALIDATION_FAILED, details);
  }

  static badRequest(message: string, details?: any) {
    return new ServiceError(message, BAD_REQUEST, details);
  }
}

export default ServiceError;
