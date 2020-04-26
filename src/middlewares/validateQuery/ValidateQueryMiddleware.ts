import { EndpointInfo, IMiddleware, Middleware, Next, QueryParams } from "@tsed/common";
import * as _ from "lodash";
import { InternalServerError, MethodNotAllowed } from "ts-httpexceptions";
import {
    ValidateQueryMiddlewareErrorKeys,
    ValidateQueryMiddlewareErrorMessages,
} from "./errors/ValidateQueryMiddlewareErrors";

@Middleware()
export class ValidateQueryMiddleWare implements IMiddleware {
    public use(
        @EndpointInfo() endpoint: EndpointInfo,
        @QueryParams() queryParams: { [key: string]: any },
        @Next() next: Express.NextFunction
    ): Express.NextFunction | undefined {
        const { requiredQueryParams } = endpoint.get(ValidateQueryMiddleWare) || {};
        if (_.isEmpty(requiredQueryParams)) {
            return next(new InternalServerError(ValidateQueryMiddlewareErrorKeys.NO_REQUIRED_QUERY_PARAMS));
        }
        if (_.isEmpty(queryParams)) {
            return next(new InternalServerError(ValidateQueryMiddlewareErrorKeys.NO_REQUIRED_QUERY_PARAMS));
        }
        const missingParams = _.filter(Object.keys(queryParams), (paramKey) => {
            return !_.includes(requiredQueryParams, paramKey);
        });
        if (!_.isEmpty(missingParams)) {
            let errorMessage = ValidateQueryMiddlewareErrorMessages[ValidateQueryMiddlewareErrorKeys.NO_QUERY_PARAMS];
            errorMessage = errorMessage.replace("[QUERY_PARAMS]", missingParams.join(","));
            return next(new MethodNotAllowed(errorMessage));
        }
        return next();
    }
}
