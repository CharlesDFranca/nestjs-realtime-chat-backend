import { MessageEditExpiredError } from "@/conversation/domain/errors/message-edit-expired.error";
import { MessageEditNotAllowedError } from "@/conversation/domain/errors/message-edit-not-allowed.error";
import { Message } from "../../message.entity";

describe("Message Entity", () => {
    const senderId = "user-1";
    const conversationId = "chat-1";
    const content = "Hello world!";
    const messageId = "msg-1";

    describe("create", () => {
        it("should create a message with correct properties", () => {
            const message = Message.create(messageId, {
                senderId,
                conversationId,
                content,
            });

            expect(message.id).toBe(messageId);
            expect(message.senderId).toBe(senderId);
            expect(message.conversationId).toBe(conversationId);
            expect(message.content.value).toBe(content);
            expect(message.editedAt).toBeUndefined();
            expect(message.createdAt).toBeInstanceOf(Date);
            expect(message.updatedAt).toBeInstanceOf(Date);
        });
    });

    describe("editContent", () => {
        let message: Message;

        beforeEach(() => {
            message = Message.create(messageId, {
                senderId,
                conversationId,
                content,
            });
        });

        it("should allow the sender to edit within max time", () => {
            const newContent = "Updated message";
            jest.useFakeTimers().setSystemTime(
                message.createdAt.getTime() + 5 * 60 * 1000,
            );

            message.editContent(senderId, newContent);

            expect(message.content.value).toBe(newContent);
            expect(message.editedAt).toBeInstanceOf(Date);
            expect(message.updatedAt.getTime()).toBeGreaterThan(
                message.createdAt.getTime(),
            );
        });

        it("should not allow editing by a different sender", () => {
            expect(() =>
                message.editContent("other-user", "New content"),
            ).toThrow(MessageEditNotAllowedError);
        });

        it("should not allow editing after max edit time", () => {
            const expiredTime =
                message.createdAt.getTime() +
                (Message as any).MAX_EDIT_TIME_IN_MINUTES * 60 * 1000 +
                1000;
            jest.useFakeTimers().setSystemTime(expiredTime);

            expect(() => message.editContent(senderId, "New content")).toThrow(
                MessageEditExpiredError,
            );
        });

        it("should not update editedAt if content is the same", () => {
            jest.useFakeTimers().setSystemTime(
                message.createdAt.getTime() + 5 * 60 * 1000,
            );

            message.editContent(senderId, content);

            expect(message.editedAt).toBeUndefined();
            expect(message.updatedAt.getTime()).toBe(
                message.createdAt.getTime(),
            );
        });

        it("should update editedAt and updatedAt when content changes", () => {
            const newContent = "Another update";
            jest.useFakeTimers().setSystemTime(
                message.createdAt.getTime() + 10 * 60 * 1000,
            );

            message.editContent(senderId, newContent);

            expect(message.content.value).toBe(newContent);
            expect(message.editedAt).toBeInstanceOf(Date);
            expect(message.updatedAt.getTime()).toBeGreaterThan(
                message.createdAt.getTime(),
            );
        });

        afterEach(() => {
            jest.useRealTimers();
        });
    });

    describe("getters", () => {
        it("should return correct values for senderId, conversationId, content, editedAt", () => {
            const message = Message.create(messageId, {
                senderId,
                conversationId,
                content,
            });

            expect(message.senderId).toBe(senderId);
            expect(message.conversationId).toBe(conversationId);
            expect(message.content.value).toBe(content);
            expect(message.editedAt).toBeUndefined();
        });
    });
});
