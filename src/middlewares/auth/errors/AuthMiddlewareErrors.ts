const contextName = "AuthMiddleware";

export enum AuthMiddlewareErrorKeys {
  UNAUTHORIZED = "AuthMiddleware_UNAUTHORIZED",
}

export const AuthMiddlewareErrorMessages = {
  [AuthMiddlewareErrorKeys.UNAUTHORIZED]: "User is unauthorized"
};