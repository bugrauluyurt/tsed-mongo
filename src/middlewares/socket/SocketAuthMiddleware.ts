import { Args, SocketMiddleware, Socket } from "@tsed/socketio";
import { $log } from "@tsed/logger";
import { Locals, Next } from "@tsed/common";
import { isDev } from "../../../config/env";
import { UserAgents } from "../../enums/UserAgents";
import * as _ from "lodash";
import { SocketMessage } from "../../models/socket/SocketMessage";
import { SocketAuthMiddlewareErrorKeys } from "./errors/SocketAuthMiddlewareErrors";

@SocketMiddleware()
export class SocketAuthMiddleware {
    async use(@Args() args: any[], @Locals() locals: any, @Next() next: Next, @Socket socket: Socket) {
        if (isDev() && _.includes(locals.ua, UserAgents.POSTMAN)) {
            return next();
        }
        if (!socket?.request?.isAuthenticated()) {
            return next(new SocketMessage(undefined, SocketAuthMiddlewareErrorKeys.UNAUTHORIZED));
        }
        return next();
    }
}
