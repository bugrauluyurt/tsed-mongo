import { RequestHandler } from "express";

class SessionMiddlewareHelper {
    private sessionMiddleware: RequestHandler;

    setSessionMiddleware(requestHandler: RequestHandler): void {
        this.sessionMiddleware = requestHandler;
    }

    getMiddleware(): RequestHandler {
        return this.sessionMiddleware;
    }
}

export default new SessionMiddlewareHelper();
