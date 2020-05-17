import { Middleware, Req, QueryParams, Next } from "@tsed/common";
import { removePollutingKeys } from "../../../utils/removePollutingKeys";

@Middleware()
export class ParameterPollutionMiddleware {
    use(@Req() req: Express.Request, @QueryParams() queryParams: object, @Next() next: Next): void {
        if (!req) return next();
        req["query"] = removePollutingKeys(queryParams);
        next();
    }
}
