import { IO, Nsp, Socket, SocketService, SocketSession, SocketUseBefore } from "@tsed/socketio";
import * as SocketIO from "socket.io";
import { SocketMiddlewareLogger } from "../../middlewares/socketLogger/SocketLoggerMiddleware";

// @TODO: Add passport middleware to take the user session in for authentication purposes.
// @TODO Put an error handler middleware.
@SocketService("/socket-default-ns")
@SocketUseBefore(SocketMiddlewareLogger)
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
}
