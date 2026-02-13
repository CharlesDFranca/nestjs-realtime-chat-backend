import { ApplicationError } from "@/shared/app/errors/application.error";

export class ConversationNotFound extends ApplicationError {
    code = "CONVERSATION_NOT_FOUND";

    constructor() {
        super("Conversation not found");
    }
}
