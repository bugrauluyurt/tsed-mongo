import { Err, GlobalErrorHandlerMiddleware, OverrideProvider, Req, Res } from "@tsed/common";
import * as _ from "lodash";
import { Exception } from "@tsed/exceptions";
import { isDev } from "../../../config/env";
import CustomError from "../../models/customErrors/CustomError";
import { ERROR_UNKNOWN } from "../../errors/GeneralError";

@OverrideProvider(GlobalErrorHandlerMiddleware)
export class ErrorHandlerMiddleware extends GlobalErrorHandlerMiddleware {
    use(@Err() error: any, @Req() request: Req, @Res() response: Res): any {
        if (error instanceof Exception || error.status) {
            const customError = new CustomError({
                status: _.get(error, "status", 404),
                type: _.get(error, "type"),
                key: _.get(error, "body.key") || _.get(error, "name"),
                message: _.get(error, "body.message") || ERROR_UNKNOWN,
                origin: _.get(error, "origin") || _.get(request, "url"),
            });
            const stack = _.get(error, "stack", "");
            if (stack.indexOf("ValidationError") !== -1 || stack.indexOf("CastError") !== -1) {
                customError.message = _.get(stack.split("\n"), "0");
            }
            if (isDev()) {
                if (!customError.message || customError.message === ERROR_UNKNOWN) {
                    customError.message = _.get(error, "stack", ERROR_UNKNOWN);
                }
                request["log"].error({
                    error: { customError, stack: _.get(error, "stack") },
                });
            }
            this.setHeaders(response, error, error.origin);
            response.status(error.status).json(customError);
            return;
        }
        return super.use(error, request, response);
    }
}
