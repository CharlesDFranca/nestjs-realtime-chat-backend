export class MessageEditNotAllowedError extends Error {
    constructor() {
        super("Only the sender can edit the message");
    }
}
