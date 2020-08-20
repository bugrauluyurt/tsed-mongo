import { Socket, SocketErr, SocketEventName, SocketMiddlewareError } from "@tsed/socketio";
import { SocketMessage } from "../../models/socket/SocketMessage";
import { $log } from "ts-log-debug";

@SocketMiddlewareError()
export class SockerErrorMiddleware {
    async use(@SocketEventName eventName: string, @SocketErr err: any, @Socket socket: Socket) {
        $log.debug("[Socket] Error =>", err);
        socket.emit("error", new SocketMessage(undefined, "Socket error"));
    }
}
