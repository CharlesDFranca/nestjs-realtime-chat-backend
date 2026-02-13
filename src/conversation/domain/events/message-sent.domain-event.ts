import { IDomainEvent } from "@/shared/domain/contracts/domain-event";

export class MessageSentDomainEvent implements IDomainEvent {
    public readonly occurredAt: Date;
    public static readonly EVENT_NAME = "message.sent";

    constructor(
        public readonly conversationId: string,
        public readonly messageId: string,
        public readonly senderId: string,
    ) {
        this.occurredAt = new Date();
    }

    public eventName(): string {
        return MessageSentDomainEvent.EVENT_NAME;
    }
}
