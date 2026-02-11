import { Entity } from "@/shared/domain/entities/entity";
import { Message } from "./message.entity";
import { Participant } from "./participant.entity";
import { MessageSentDomainEvent } from "../events/message-sent.domain-event";

export abstract class Conversation extends Entity {
    private _lastMessageId?: string;
    private _lastMessageOccurredAt?: Date;

    constructor(id: string, createdAt: Date, updatedAt: Date) {
        super(id, createdAt, updatedAt);
    }

    public abstract assertParticipant(id: string): Participant;

    public sendMessage(
        messageId: string,
        senderId: string,
        content: string,
    ): Message {
        this.assertParticipant(senderId);

        const message = Message.create(messageId, {
            content,
            senderId,
            conversationId: this.id,
        });

        this._lastMessageId = message.id;

        const event = new MessageSentDomainEvent(
            this.id,
            message.id,
            message.senderId,
        );

        this._lastMessageOccurredAt = event.occurredAt;

        this.addDomainEvent(event);

        this.touch();

        return message;
    }

    public get lastMessageId(): string | undefined {
        return this._lastMessageId;
    }

    public get lastMessageOccurredAt(): Date | undefined {
        return this._lastMessageOccurredAt;
    }
}
