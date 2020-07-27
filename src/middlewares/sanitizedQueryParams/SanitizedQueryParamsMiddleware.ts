import { Middleware, Req, QueryParams, Next } from "@tsed/common";
import { getSanitizedQueryParams } from "../../utils/getSanitizedQueryParams";

@Middleware()
export class SanitizedQueryParamsMiddleware {
    use(@Req() req: Express.Request, @QueryParams() queryParams: object, @Next() next: Next): void {
        if (!req) return next();
        req["query"] = getSanitizedQueryParams(queryParams);
        next();
    }
}
