import { Message } from "../entities/message.entity";

export interface MessageRepository {
    save(message: Message): Promise<void>;
    findById(id: string): Promise<Message | null>;
    listMessagesByConversation(conversationId: string): Promise<Message[]>;
}
