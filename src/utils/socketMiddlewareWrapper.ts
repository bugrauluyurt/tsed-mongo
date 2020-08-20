export const socketMiddlewareWrapper = (middleware) => (socket, next) => middleware(socket.request, {}, next);
