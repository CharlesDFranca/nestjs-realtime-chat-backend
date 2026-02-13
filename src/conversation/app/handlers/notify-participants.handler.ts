import { MessageSentDomainEvent } from "@/conversation/domain/events/message-sent.domain-event";
import { EventHandler } from "@/shared/app/contracts/event-bus";

export class NotifyParticipantsHandler implements EventHandler<MessageSentDomainEvent> {
    public eventName(): string {
        return MessageSentDomainEvent.EVENT_NAME;
    }

    async handle(event: MessageSentDomainEvent): Promise<void> {
        console.log("Notifying: ", event.messageId);
    }
}
