export enum ValidateQueryMiddlewareErrorKeys {
    NO_REQUIRED_QUERY_PARAMS = "ValidateQueryMiddleware_NO_REQUIRED_QUERY_PARAMS",
    NO_QUERY_PARAMS = "ValidateQueryMiddleware_NO_QUERY_PARAMS",
    MISSING_QUERY_PARAMS = "ValidateQueryMiddleware_MISSING_QUERY_PARAMS",
}

export const ValidateQueryMiddlewareErrorMessages = {
    [ValidateQueryMiddlewareErrorKeys.NO_REQUIRED_QUERY_PARAMS]:
        "Required queryParams should be written for given endpoint.",
    [ValidateQueryMiddlewareErrorKeys.NO_QUERY_PARAMS]:
        "Please send the required queryParams as specified in API documentation.",
    [ValidateQueryMiddlewareErrorKeys.MISSING_QUERY_PARAMS]: "Query params [[QUERY_PARAMS]] missing",
};
