import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { ConversationController } from "./conversation.controller";
import { SendMessageUseCase } from "./app/use-cases/send-message.use-case";
import { NotifyParticipantsHandler } from "./app/handlers/notify-participants.handler";
import type { EventHandler, IEventBus } from "@/shared/app/contracts/event-bus";
import { IDomainEvent } from "@/shared/domain/contracts/domain-event";

@Module({
    imports: [],
    controllers: [ConversationController],
    providers: [
        ConversationService,
        SendMessageUseCase,
        NotifyParticipantsHandler,
        {
            provide: "CONVERSATION_HANDLERS",
            useExisting: NotifyParticipantsHandler,
        },
    ],
})
export class ConversationModule implements OnModuleInit {
    constructor(
        private readonly eventBus: IEventBus,
        @Inject("CONVERSATION_HANDLERS")
        private readonly handlers: EventHandler<IDomainEvent>[],
    ) {}

    onModuleInit() {
        this.handlers.forEach((handler) => {
            this.eventBus.subscribe(handler.eventName(), handler);
        });
    }
}
