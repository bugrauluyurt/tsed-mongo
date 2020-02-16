export enum AuthMiddlewareErrorKeys {
  UNAUTHORIZED = "AuthMiddleware_UNAUTHORIZED",
  FORBIDDEN = "AuthMiddleware_FORBIDDEN"
}

export const AuthMiddlewareErrorMessages = {
  [AuthMiddlewareErrorKeys.UNAUTHORIZED]: "User is unauthorized",
  [AuthMiddlewareErrorKeys.FORBIDDEN]: "User role requirement is not met. Forbidden to access"
};
