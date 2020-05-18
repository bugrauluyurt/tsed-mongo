import { Err, GlobalErrorHandlerMiddleware, OverrideProvider, Req, Res } from "@tsed/common";
import * as _ from "lodash";
import { Exception } from "@tsed/exceptions";
import { isDev } from "../../../config/env";
import CustomError from "../../models/customErrors/CustomError";

@OverrideProvider(GlobalErrorHandlerMiddleware)
export class ErrorHandlerMiddleware extends GlobalErrorHandlerMiddleware {
    use(@Err() error: any, @Req() request: Req, @Res() response: Res): any {
        if (error instanceof Exception || error.status) {
            const customError = new CustomError({
                status: _.get(error, "status", 404),
                type: _.get(error, "type"),
                key: _.get(error, "body.key") || _.get(error, "name"),
                message: _.get(error, "body.message"),
                origin: _.get(error, "origin") || _.get(request, "url"),
            });
            if (isDev()) {
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
