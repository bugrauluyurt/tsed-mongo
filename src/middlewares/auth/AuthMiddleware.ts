import { AuthenticatedMiddleware, EndpointInfo, EndpointMetadata, Req } from "@tsed/common";
import { Unauthorized } from "ts-httpexceptions";
import { $log } from "ts-log-debug";
import { OverrideProvider } from "@tsed/di";

// @TODO Write a custom middleware to check authentication
// Things to check are: Session Expiration and Roles
@OverrideProvider(AuthenticatedMiddleware)
export class AuthMiddleware {
    constructor() {
    }

    use(@EndpointInfo() endpoint: EndpointMetadata,
        @Req() request: Express.Request) {

        // retrieve Options passed to the Authenticated() decorators.
        const options = endpoint.store.get(AuthenticatedMiddleware) || {};
        $log.debug("AuthMiddleware =>", options);
        $log.debug("AuthMiddleware isAuthenticated ? =>", request.isAuthenticated());

        if (!request.isAuthenticated()) {
            throw new Unauthorized("Unauthorized");
        }
    }
}
