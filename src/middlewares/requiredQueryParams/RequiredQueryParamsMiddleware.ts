import * as _ from "lodash";
import { InternalServerError, MethodNotAllowed } from "ts-httpexceptions";
import {
    RequiredQueryParamMiddlewareErrorKeys,
    RequiredQueryParamMiddlewareErrorMessages,
} from "./errors/RequiredQueryParamMiddlewareErrors";

export const RequiredQueryParamsMiddleware = (requiredParams: string[]) => {
    return (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        if (_.isEmpty(requiredParams)) {
            const errorMessage =
                RequiredQueryParamMiddlewareErrorMessages[
                    RequiredQueryParamMiddlewareErrorKeys.NO_REQUIRED_QUERY_PARAMS
                ];
            return next(new InternalServerError(errorMessage));
        }
        const reqQuery = req["query"] || {};
        const missingParams = _.filter(requiredParams, (requiredParam) => {
            return !reqQuery[requiredParam];
        });
        if (!_.isEmpty(missingParams)) {
            let errorMessage =
                RequiredQueryParamMiddlewareErrorMessages[RequiredQueryParamMiddlewareErrorKeys.MISSING_QUERY_PARAMS];
            errorMessage = errorMessage.replace("[QUERY_PARAMS]", missingParams.join(","));
            const error = new MethodNotAllowed(errorMessage);
            error.body = { message: errorMessage };
            return next(error);
        }
        return next();
    };
};
