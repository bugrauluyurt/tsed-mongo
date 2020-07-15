import { EndpointInfo, IMiddleware, Middleware, Next, Req, Locals } from "@tsed/common";
import * as _ from "lodash";
import { Forbidden, Unauthorized } from "ts-httpexceptions";
import { createCustomErrorBody } from "../../models/customErrors/CustomErrorBody";
import { AuthMiddlewareErrorKeys, AuthMiddlewareErrorMessages } from "./errors/AuthMiddlewareErrors";
import { isDev } from "../../../config/env";
import { UserAgents } from "../../enums/UserAgents";
import { User } from "../../models/users/User";
@Middleware()
export class AuthMiddleware implements IMiddleware {
    public use(
        @Req() request: Express.Request,
        @EndpointInfo() endpoint: EndpointInfo,
        @Locals() locals: any,
        @Next() next: Next
    ): void {
        if (isDev() && _.includes(locals.ua, UserAgents.POSTMAN)) {
            return next();
        }
        const options = endpoint.get(AuthMiddleware) || {};
        if (!request.isAuthenticated()) {
            // passport.js method to check auth
            const error = new Unauthorized(AuthMiddlewareErrorMessages[AuthMiddlewareErrorKeys.UNAUTHORIZED]);
            error.body = createCustomErrorBody(AuthMiddlewareErrorKeys.UNAUTHORIZED, AuthMiddlewareErrorMessages);
            return next(error);
        }

        const { roles: userRoles }: Partial<User> = request.user;
        const isRoleAuthenticated =
            _.isEmpty(userRoles) || _.some(userRoles, (userRole) => _.includes(options.roles, userRole));

        if (!isRoleAuthenticated) {
            const forbiddenError = new Forbidden(AuthMiddlewareErrorMessages[AuthMiddlewareErrorKeys.FORBIDDEN]);
            return next({
                ...forbiddenError,
                body: createCustomErrorBody(AuthMiddlewareErrorKeys.FORBIDDEN, AuthMiddlewareErrorMessages),
            });
        }
        next();
    }
}
