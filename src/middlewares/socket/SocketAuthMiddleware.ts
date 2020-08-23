import { Args, SocketMiddleware, Socket, SocketEventName, SocketErr } from "@tsed/socketio";
import { Unauthorized } from "ts-httpexceptions";
import { AuthMiddlewareErrorKeys, AuthMiddlewareErrorMessages } from "../auth/errors/AuthMiddlewareErrors";
import { createCustomErrorBody } from "../../models/customErrors/CustomErrorBody";

@SocketMiddleware()
export class SocketAuthMiddleware {
    async use(@Args() args: any, @SocketEventName eventName: string, @SocketErr err: any, @Socket socket: Socket) {
        if (!socket.request.isAuthenticated()) {
            const error = new Unauthorized(AuthMiddlewareErrorMessages[AuthMiddlewareErrorKeys.UNAUTHORIZED]);
            error.body = createCustomErrorBody(AuthMiddlewareErrorKeys.UNAUTHORIZED, AuthMiddlewareErrorMessages);
            throw error;
        }
    }
}
