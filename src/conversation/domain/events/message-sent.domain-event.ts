import { IDomainEvent } from "@/shared/domain/contracts/domain-event";

export class MessageSentDomainEvent implements IDomainEvent {
    public readonly occurredAt: Date;
    private static readonly eventName = "message.sent";

    constructor(
        public readonly conversationId: string,
        public readonly messageId: string,
        public readonly senderId: string,
    ) {
        this.occurredAt = new Date();
    }

    public name(): string {
        return MessageSentDomainEvent.eventName;
    }
}
