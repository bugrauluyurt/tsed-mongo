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
import { SocketLoggerMiddleware } from "../../middlewares/socket/SocketLoggerMiddleware";
import { SocketErrorMiddleware } from "../../middlewares/socket/SocketErrorMiddleware";
import { SocketAuthMiddleware } from "../../middlewares/socket/SocketAuthMiddleware";
import { SocketMessage } from "../../models/socket/SocketMessage";
import { SOCKET_NS_DEFAULT_EVENTS } from "./events/ns-default";

// @TODO: 1. Another thing to consider here is to separate the socket to another node app and share the session via mongo.
// For now let's keep this as is.
// @TODO: 2. Load balancing should be done correctly while passing events between the nodes are correctly done. Redis can be used for this
// See https://socket.io/docs/using-multiple-nodes/#Sticky-load-balancing.
@SocketService("/socket-ns-default")
@SocketUseBefore(SocketLoggerMiddleware)
@SocketUseBefore(SocketAuthMiddleware)
@SocketUseAfter(SocketErrorMiddleware)
export class SocketNsDefaultService {
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

    @Input(SOCKET_NS_DEFAULT_EVENTS.CLIENT.FIRST_MESSAGE)
    handleDefaultMessage(@Args(0) eventBody: string, @Socket socket: Socket, @Namespace nsp: Namespace): void {
        socket.emit(SOCKET_NS_DEFAULT_EVENTS.SERVER.FIRST_MESSAGE_SUCCESS, new SocketMessage("Hello client!"));
    }
}
