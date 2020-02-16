import { AuthenticatedMiddleware, EndpointInfo, EndpointMetadata, Next, Req } from "@tsed/common";
import { OverrideProvider } from "@tsed/di";
import { Unauthorized } from "ts-httpexceptions";
import { $log } from "ts-log-debug";
import { createCustomErrorBody } from "../../models/customErrors/CustomErrorBody";
import { AuthMiddlewareErrorKeys, AuthMiddlewareErrorMessages } from "./errors/AuthMiddlewareErrors";

// @TODO Write a custom middleware to check authentication
// Things to check are: Session Expiration and Roles
@OverrideProvider(AuthenticatedMiddleware)
export class AuthMiddleware {
    constructor() {}

    use(
        @EndpointInfo() endpoint: EndpointMetadata,
        @Req() request: Express.Request,
        @Next() next: Express.NextFunction,
    ) {
        // retrieve Options passed to the Authenticated() decorators.
        const options = endpoint.store.get(AuthenticatedMiddleware) || {};
        $log.debug("AuthMiddleware =>", options);
        $log.debug(
            "AuthMiddleware isAuthenticated ? =>",
            request.isAuthenticated()
        );

        if (!request.isAuthenticated()) {
            const error = new Unauthorized(AuthMiddlewareErrorMessages[AuthMiddlewareErrorKeys.UNAUTHORIZED]);
            error.body = createCustomErrorBody(AuthMiddlewareErrorKeys.UNAUTHORIZED, AuthMiddlewareErrorMessages);
            next(error);
        }
    }
}
