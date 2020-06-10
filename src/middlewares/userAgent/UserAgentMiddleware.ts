import { Middleware, Locals, HeaderParams, Next } from "@tsed/common";

@Middleware()
export class UserAgentMiddleware {
    use(@Locals() locals: any, @HeaderParams("User-Agent") ua: string, @Next() next: Next): void {
        locals.ua = ua;
        next();
    }
}
