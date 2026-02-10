export class MessageEditExpiredError extends Error {
    constructor() {
        super("Message can no longer be edited");
    }
}
