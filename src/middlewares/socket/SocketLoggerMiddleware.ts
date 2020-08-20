import { Args, SocketMiddleware } from "@tsed/socketio";
import { $log } from "@tsed/logger";

@SocketMiddleware()
export class SocketLoggerMiddleware {
    async use(@Args() args: any[]) {
        $log.debug("[Socket] Arguments =>", args);
        return args;
    }
}
