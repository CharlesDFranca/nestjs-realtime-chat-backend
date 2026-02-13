import { SendMessageUseCase } from "../../send-message.use-case";
import { ConversationRepository } from "@/conversation/domain/repositories/conversation-repository.interface";
import { MessageRepository } from "@/conversation/domain/repositories/message-repository.interface";
import { IdGenerator } from "@/shared/app/contracts/id-generator";
import { UnitOfWork } from "@/shared/app/contracts/unit-of-work";
import { IEventBus } from "@/shared/app/contracts/event-bus";
import { success, failure } from "@/shared/app/results/result";
import { ConversationNotFound } from "../../../errors/conversation-not-found.error";
import { Message } from "@/conversation/domain/entities/message.entity";
import { Conversation } from "@/conversation/domain/entities/conversation.entity";
import { IDomainEvent } from "@/shared/domain/contracts/domain-event";

const mockConversationRepository = {
    findById: jest.fn(),
    save: jest.fn(),
} as jest.Mocked<ConversationRepository>;

const mockMessageRepository = {
    save: jest.fn(),
} as unknown as jest.Mocked<MessageRepository>;

const mockIdGenerator = {
    generate: jest.fn(),
} as jest.Mocked<IdGenerator>;

const mockUow = {
    withTransaction: jest.fn(),
} as jest.Mocked<UnitOfWork>;

const mockEventBus = {
    publish: jest.fn(),
    subscribe: jest.fn(),
} as jest.Mocked<IEventBus>;

describe("SendMessageUseCase", () => {
    let useCase: SendMessageUseCase;

    const conversationId = "conv-123";
    const senderId = "user-456";
    const content = "Hello, world!";
    const generatedMessageId = "msg-789";

    const input = { conversationId, senderId, content };

    let mockConversation: jest.Mocked<Conversation>;
    let mockMessage: jest.Mocked<Message>;
    let mockDomainEvents: IDomainEvent[];

    beforeEach(() => {
        jest.clearAllMocks();

        mockConversation = {
            id: conversationId,
            sendMessage: jest.fn(),
            pullDomainEvents: jest.fn(),
        } as unknown as jest.Mocked<Conversation>;

        mockMessage = {
            id: generatedMessageId,
        } as jest.Mocked<Message>;

        mockDomainEvents = [
            {
                occurredAt: new Date(),
            } as IDomainEvent,
        ];

        mockIdGenerator.generate.mockReturnValue(generatedMessageId);
        mockConversation.sendMessage.mockReturnValue(mockMessage);
        mockConversation.pullDomainEvents.mockReturnValue(mockDomainEvents);
        mockConversationRepository.findById.mockResolvedValue(mockConversation);
        mockConversationRepository.save.mockResolvedValue(undefined);
        mockMessageRepository.save.mockResolvedValue(undefined);

        mockUow.withTransaction.mockImplementation(async (callback) => {
            return await callback();
        });

        mockEventBus.publish.mockResolvedValue(undefined);

        useCase = new SendMessageUseCase(
            mockConversationRepository,
            mockMessageRepository,
            mockUow,
            mockEventBus,
            mockIdGenerator,
        );
    });

    it("should successfully send a message and return the message ID", async () => {
        const result = await useCase.execute(input);

        expect(mockUow.withTransaction).toHaveBeenCalledTimes(1);
        expect(mockUow.withTransaction).toHaveBeenCalledWith(
            expect.any(Function),
        );

        expect(mockConversationRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockConversationRepository.findById).toHaveBeenCalledWith(
            conversationId,
        );

        expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
        expect(mockConversation.sendMessage).toHaveBeenCalledTimes(1);
        expect(mockConversation.sendMessage).toHaveBeenCalledWith(
            generatedMessageId,
            senderId,
            content,
        );

        expect(mockMessageRepository.save).toHaveBeenCalledTimes(1);
        expect(mockMessageRepository.save).toHaveBeenCalledWith(mockMessage);
        expect(mockConversationRepository.save).toHaveBeenCalledTimes(1);
        expect(mockConversationRepository.save).toHaveBeenCalledWith(
            mockConversation,
        );

        expect(mockConversation.pullDomainEvents).toHaveBeenCalledTimes(1);
        expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
        expect(mockEventBus.publish).toHaveBeenCalledWith(mockDomainEvents);

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.value).toEqual({ messageId: generatedMessageId });
        }
    });

    it("should return a failure when conversation does not exist", async () => {
        mockConversationRepository.findById.mockResolvedValue(null);

        const result = await useCase.execute(input);

        expect(mockConversation.sendMessage).not.toHaveBeenCalled();
        expect(mockMessageRepository.save).not.toHaveBeenCalled();
        expect(mockConversationRepository.save).not.toHaveBeenCalled();
        expect(mockConversation.pullDomainEvents).not.toHaveBeenCalled();
        expect(mockEventBus.publish).not.toHaveBeenCalled();

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.value).toBeInstanceOf(ConversationNotFound);
        }
    });

    it("should not publish events when transaction callback returns a failure", async () => {
        const transactionError = new Error("Database error");
        mockUow.withTransaction.mockImplementation(async () => {
            return failure(transactionError);
        });

        const result = await useCase.execute(input);

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.value).toBe(transactionError);
        }

        expect(mockEventBus.publish).not.toHaveBeenCalled();
    });

    it("should throw when the transaction callback throws", async () => {
        const transactionError = new Error("Transaction rollback");
        mockUow.withTransaction.mockImplementation(async () => {
            throw transactionError;
        });

        await expect(useCase.execute(input)).rejects.toThrow(transactionError);

        expect(mockEventBus.publish).not.toHaveBeenCalled();
    });

    it("should still call eventBus.publish even if there are no domain events", async () => {
        mockConversation.pullDomainEvents.mockReturnValue([]);

        const result = await useCase.execute(input);

        expect(result.ok).toBe(true);
        expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
        expect(mockEventBus.publish).toHaveBeenCalledWith([]);
    });

    it("should generate exactly one message ID per execution", async () => {
        await useCase.execute(input);
        expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);

        await useCase.execute({ ...input, content: "Second message" });
        expect(mockIdGenerator.generate).toHaveBeenCalledTimes(2);
    });

    it("should call messageRepository.save and conversationRepository.save concurrently", async () => {
        let resolveSave1: (value: void) => void;
        let resolveSave2: (value: void) => void;

        mockMessageRepository.save.mockReturnValue(
            new Promise((res) => {
                resolveSave1 = res;
            }),
        );
        mockConversationRepository.save.mockReturnValue(
            new Promise((res) => {
                resolveSave2 = res;
            }),
        );

        const executePromise = useCase.execute(input);

        await new Promise((resolve) => setImmediate(resolve));

        expect(mockMessageRepository.save).toHaveBeenCalled();
        expect(mockConversationRepository.save).toHaveBeenCalled();

        resolveSave1!(undefined);
        resolveSave2!(undefined);

        await executePromise;
    });

    it("should execute the entire operation within a single transaction", async () => {
        await useCase.execute(input);

        expect(mockUow.withTransaction).toHaveBeenCalledTimes(1);

        expect(mockConversationRepository.findById).toHaveBeenCalled();
        expect(mockMessageRepository.save).toHaveBeenCalled();
        expect(mockConversationRepository.save).toHaveBeenCalled();
    });

    it("should pull domain events only after sending the message", async () => {
        const sendMessageSpy = jest.spyOn(mockConversation, "sendMessage");
        const pullEventsSpy = jest.spyOn(mockConversation, "pullDomainEvents");

        await useCase.execute(input);

        expect(sendMessageSpy).toHaveBeenCalledBefore(pullEventsSpy);
    });

    it("should return a success result with the message ID", async () => {
        const result = await useCase.execute(input);
        expect(result).toEqual(success({ messageId: generatedMessageId }));
    });

    it("should throw if conversation.sendMessage throws an error", async () => {
        const domainError = new Error("Invalid message");
        mockConversation.sendMessage.mockImplementation(() => {
            throw domainError;
        });

        await expect(useCase.execute(input)).rejects.toThrow(domainError);

        expect(mockMessageRepository.save).not.toHaveBeenCalled();
        expect(mockConversationRepository.save).not.toHaveBeenCalled();
        expect(mockEventBus.publish).not.toHaveBeenCalled();
    });
});
