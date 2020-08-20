import {
    IO,
    Nsp,
    Socket,
    SocketService,
    SocketSession,
    SocketUseBefore,
    Namespace,
    Args,
    Input,
    SocketUseAfter,
} from "@tsed/socketio";
import * as SocketIO from "socket.io";
import { SocketMessage } from "../../models/socket/SocketMessage";
import { $log } from "ts-log-debug";
import { SocketDefaultClientEvents } from "./events/default";
import { SocketLoggerMiddleware } from "../../middlewares/socket/SocketLoggerMiddleware";
import { SockerErrorMiddleware } from "../../middlewares/socket/SocketErrorMiddleware";
import { SocketAuthMiddleware } from "../../middlewares/socket/SocketAuthMiddleware";

@SocketService("/socket-message-ns")
@SocketUseBefore(SocketLoggerMiddleware)
@SocketUseBefore(SocketAuthMiddleware)
@SocketUseAfter(SockerErrorMiddleware)
export class MySocketService {
    @Nsp nsp: SocketIO.Namespace;

    // @Nsp("/socket-other-ns")
    // nspOther: SocketIO.Namespace; // communication between two namespace

    constructor(@IO private io: SocketIO.Server) {}

    /**
     * Triggered the namespace is created
     */
    $onNamespaceInit(nsp: SocketIO.Namespace): void {}

    /**
     * Triggered when a new client connects to the Namespace.
     */
    $onConnection(@Socket socket: SocketIO.Socket, @SocketSession session: SocketSession): void {}

    /**
     * Triggered when a client disconnects from the Namespace.
     */
    $onDisconnect(@Socket socket: SocketIO.Socket): void {}

    @Input(SocketDefaultClientEvents.EVENT_MESSAGE)
    myMethod(@Args(0) eventBody: SocketMessage, @Socket socket: Socket, @Namespace nsp: Namespace): void {
        $log.debug(SocketDefaultClientEvents.EVENT_MESSAGE, eventBody);
    }
}
