import { Socket, SocketErr, SocketEventName, SocketMiddlewareError } from "@tsed/socketio";
import { $log } from "ts-log-debug";
import { AuthMiddlewareErrorKeys } from "../auth/errors/AuthMiddlewareErrors";
import { SocketMessage } from "../../models/socket/SocketMessage";
import { SOCKET_NS_GENERIC_EVENTS } from "../../services/socket/events/ns-generic";

@SocketMiddlewareError()
export class SocketErrorMiddleware {
    async use(@SocketEventName eventName: string, @SocketErr err: any, @Socket socket: Socket) {
        $log.debug(err);
        socket.emit(
            err?.body?.key === AuthMiddlewareErrorKeys.UNAUTHORIZED
                ? SOCKET_NS_GENERIC_EVENTS.SERVER.AUTH_ERROR
                : SOCKET_NS_GENERIC_EVENTS.SERVER.DEFAULT_ERROR,
            new SocketMessage(err, true)
        );
    }
}
