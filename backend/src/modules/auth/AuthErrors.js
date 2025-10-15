export class AuthError extends Error {}
export class InvalidCredentialsError extends AuthError {}
export class UserAlreadyExistsError extends AuthError {}
export class UserNotFoundError extends AuthError {}
export class UnauthorizedError extends AuthError {}
