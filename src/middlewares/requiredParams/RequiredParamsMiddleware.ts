import * as _ from "lodash";
import { InternalServerError, MethodNotAllowed } from "ts-httpexceptions";
import {
    RequiredParamsMiddlewareErrorKeys,
    RequiredParamsMiddlewareErrorMessages,
} from "./errors/RequiredParamsMiddlewareErrors";
import { RequiredParamsMiddlewareMeta } from "src/types/RequiredParamsMiddlewareMeta";

const fillParamType = (errorMessage: string, type: string): string => {
    return _.replace(errorMessage, "[PARAM_TYPE]", type);
};

const fillMissingParams = (errorMessage: string, missingParams: string[]): string => {
    return _.replace(errorMessage, "[PARAMS]", missingParams.join(","));
};

const generateErrorMessage = (errorMessage: string, type: string, missingParams?: string[]): string => {
    const returnMessage = fillParamType(errorMessage, type);
    return _.isEmpty(missingParams) ? returnMessage : fillMissingParams(returnMessage, missingParams);
};

export const RequiredParamsMiddleware = (meta: RequiredParamsMiddlewareMeta) => {
    return (req: Express.Request, res: Express.Response, next: Express.NextFunction): void => {
        const { requiredParams, type } = meta;
        if (_.isEmpty(requiredParams)) {
            const errorMessage =
                RequiredParamsMiddlewareErrorMessages[RequiredParamsMiddlewareErrorKeys.NO_REQUIRED_PARAMS];
            return next(new InternalServerError(fillParamType(errorMessage, type)));
        }
        const paramType = type === "path" ? "params" : "query";
        const reqQuery = req[paramType] || {};
        const missingParams = _.filter(requiredParams, (requiredParam) => {
            return !reqQuery[requiredParam];
        });
        if (!_.isEmpty(missingParams)) {
            const errorMessage = generateErrorMessage(
                RequiredParamsMiddlewareErrorMessages[RequiredParamsMiddlewareErrorKeys.MISSING_PARAMS],
                type,
                missingParams
            );
            const error = new MethodNotAllowed(errorMessage);
            error.body = { message: errorMessage };
            return next(error);
        }
        return next();
    };
};
