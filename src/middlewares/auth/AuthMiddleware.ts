import { EndpointInfo, IMiddleware, Middleware, Next, Req } from "@tsed/common";
import * as _ from "lodash";
import { User } from "src/models/users/User";
import { Forbidden, Unauthorized } from "ts-httpexceptions";
import { createCustomErrorBody } from "../../models/customErrors/CustomErrorBody";
import { AuthMiddlewareErrorKeys, AuthMiddlewareErrorMessages } from "./errors/AuthMiddlewareErrors";

@Middleware()
export class AuthMiddleware implements IMiddleware {
    public use(
        @Req() request: Express.Request,
        @EndpointInfo() endpoint: EndpointInfo,
        @Next() next: Express.NextFunction
    ): Express.NextFunction {
        const options = endpoint.get(AuthMiddleware) || {};

        if (!request.isAuthenticated()) {
            // passport.js method to check auth
            const error = new Unauthorized(AuthMiddlewareErrorMessages[AuthMiddlewareErrorKeys.UNAUTHORIZED]);
            error.body = createCustomErrorBody(AuthMiddlewareErrorKeys.UNAUTHORIZED, AuthMiddlewareErrorMessages);
            return next(error);
        }

        const { roles: userRoles }: Partial<User> = request.user;
        const isRoleAuthenticated = _.some(userRoles, (userRole) => _.includes(options.roles, userRole));

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
