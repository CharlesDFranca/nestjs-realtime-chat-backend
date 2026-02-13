import type { ConversationRepository } from "@/conversation/domain/repositories/conversation-repository.interface";
import type { MessageRepository } from "@/conversation/domain/repositories/message-repository.interface";
import type { IdGenerator } from "@/shared/app/contracts/id-generator";
import { IUseCase } from "@/shared/app/contracts/use-case";
import { failure, Result, success } from "@/shared/app/results/result";
import { ConversationNotFound } from "../errors/conversation-not-found.error";
import type { IEventBus } from "@/shared/app/contracts/event-bus";
import type { UnitOfWork } from "@/shared/app/contracts/unit-of-work";
import { IDomainEvent } from "@/shared/domain/contracts/domain-event";
import { Injectable } from "@nestjs/common";

type SendMessageInput = {
    conversationId: string;
    senderId: string;
    content: string;
};
type SendMessageOutput = { messageId: string };

@Injectable()
export class SendMessageUseCase implements IUseCase<
    SendMessageInput,
    SendMessageOutput
> {
    constructor(
        private readonly conversationRepository: ConversationRepository,
        private readonly messageRepository: MessageRepository,
        private readonly uow: UnitOfWork,
        private readonly eventBus: IEventBus,
        private readonly idGenerator: IdGenerator,
    ) {}

    async execute(input: SendMessageInput): Promise<Result<SendMessageOutput>> {
        let events: IDomainEvent[] = [];

        const result = await this.uow.withTransaction(async () => {
            const conversation = await this.conversationRepository.findById(
                input.conversationId,
            );

            if (!conversation) return failure(new ConversationNotFound());

            const message = conversation.sendMessage(
                this.idGenerator.generate(),
                input.senderId,
                input.content,
            );

            await Promise.all([
                this.messageRepository.save(message),
                this.conversationRepository.save(conversation),
            ]);

            events = [...conversation.pullDomainEvents()];

            return success({
                messageId: message.id,
            });
        });

        if (!result.ok) return result;

        await this.eventBus.publish(events);

        return success({ messageId: result.value.messageId });
    }
}
