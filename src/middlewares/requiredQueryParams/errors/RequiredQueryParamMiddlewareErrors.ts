export enum RequiredQueryParamMiddlewareErrorKeys {
    NO_REQUIRED_QUERY_PARAMS = "ValidateQueryMiddleware_NO_REQUIRED_QUERY_PARAMS",
    NO_QUERY_PARAMS = "ValidateQueryMiddleware_NO_QUERY_PARAMS",
    MISSING_QUERY_PARAMS = "ValidateQueryMiddleware_MISSING_QUERY_PARAMS",
}

export const RequiredQueryParamMiddlewareErrorMessages = {
    [RequiredQueryParamMiddlewareErrorKeys.NO_REQUIRED_QUERY_PARAMS]:
        "Required queryParams should be written for given endpoint.",
    [RequiredQueryParamMiddlewareErrorKeys.NO_QUERY_PARAMS]:
        "Please send the required queryParams as specified in API documentation.",
    [RequiredQueryParamMiddlewareErrorKeys.MISSING_QUERY_PARAMS]: "Query params [[QUERY_PARAMS]] missing",
};
