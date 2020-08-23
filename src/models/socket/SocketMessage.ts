export class SocketMessage {
    constructor(private message: any, private isError = false, private createdAt = Date.now()) {}
}
