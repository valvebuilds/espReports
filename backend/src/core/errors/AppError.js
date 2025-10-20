/**
 * Base application error class
 * All custom errors should extend this class
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error for input validation failures
 */
export class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, 400);
    this.field = field;
    this.type = 'VALIDATION_ERROR';
  }
}

/**
 * Not found error for missing resources
 */
export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.type = 'NOT_FOUND_ERROR';
  }
}

/**
 * Authentication and authorization errors
 */
export class AuthError extends AppError {
  constructor(message, statusCode = 401) {
    super(message, statusCode);
    this.type = 'AUTH_ERROR';
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

export class ForbiddenError extends AuthError {
  constructor(message = 'Forbidden access') {
    super(message, 403);
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(message = 'Invalid credentials') {
    super(message, 401);
  }
}

export class UserNotFoundError extends AuthError {
  constructor(message = 'User not found') {
    super(message, 404);
  }
}

export class UserAlreadyExistsError extends AuthError {
  constructor(message = 'User already exists') {
    super(message, 409);
  }
}

export class AreaNotFoundError extends AuthError {
  constructor(message = 'Area not found') {
    super(message, 404);
  }
}
