import { Middleware, Req, QueryParams, Next } from "@tsed/common";
import { removePollutingKeys } from "../../../utils/removePollutingKeys";

@Middleware()
export class ParameterPollutionMiddleware {
    use(@Req() req: Req, @QueryParams() queryParams: object, @Next() next: Express.NextFunction): void {
        if (!req) return next();
        req.query = removePollutingKeys(queryParams);
        next();
    }
}
