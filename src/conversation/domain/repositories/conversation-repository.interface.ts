import { Conversation } from "../entities/conversation.entity";

export interface ConversationRepository {
    save(conversation: Conversation): Promise<void>;
    findById(conversationId: string): Promise<Conversation | null>;
}
