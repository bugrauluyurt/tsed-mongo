export enum RequiredParamsMiddlewareErrorKeys {
    NO_REQUIRED_PARAMS = "RequiredParamsMiddleware_NO_REQUIRED_PARAMS",
    NO_PARAMS = "RequiredParamsMiddleware_NO_PARAMS",
    MISSING_PARAMS = "RequiredParamsMiddleware_MISSING_PARAMS",
}

export const RequiredParamsMiddlewareErrorMessages = {
    [RequiredParamsMiddlewareErrorKeys.NO_REQUIRED_PARAMS]:
        "Required [PARAM_TYPE]Params should be written for given endpoint.",
    [RequiredParamsMiddlewareErrorKeys.NO_PARAMS]:
        "Please send the required [PARAM_TYPE]Params as specified in API documentation.",
    [RequiredParamsMiddlewareErrorKeys.MISSING_PARAMS]: "[PARAM_TYPE]Params [[PARAMS]] missing",
};
