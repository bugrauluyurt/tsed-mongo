export class SocketMessage {
    type = "message";
    constructor(public data: any, public isError = false, private createdAt = Date.now()) {}
}
