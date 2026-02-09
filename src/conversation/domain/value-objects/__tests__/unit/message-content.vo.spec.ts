import { MessageContent } from "../../message-content.vo";

describe("MessageContent Value Object", () => {
    describe("creation", () => {
        it("should create a valid message content", () => {
            const messageContent = MessageContent.create("john_doe");

            expect(messageContent.value).toBe("john_doe");
        });

        it("should trim whitespace from message content", () => {
            const messageContent = MessageContent.create("   john_doe   ");

            expect(messageContent.value).toBe("john_doe");
        });
    });

    describe("validation", () => {
        it("should throw if message content is empty", () => {
            expect(() => {
                MessageContent.create("");
            }).toThrow("The message content cannot be empty.");
        });

        it("should throw if message content is only whitespace", () => {
            expect(() => {
                MessageContent.create("   ");
            }).toThrow("The message content cannot be empty.");
        });

        it("should throw if message content exceeds 5000 characters", () => {
            const longMessageContent = "a".repeat(5001);

            expect(() => {
                MessageContent.create(longMessageContent);
            }).toThrow("The message content cannot exceed 5000 characters.");
        });
    });

    describe("equality", () => {
        it("should consider message content with same value as equal", () => {
            const messageContent1 = MessageContent.create("john");
            const messageContent2 = MessageContent.create("john");

            expect(messageContent1.equals(messageContent2)).toBe(true);
        });

        it("should consider message content with different values as not equal", () => {
            const messageContent1 = MessageContent.create("john");
            const messageContent2 = MessageContent.create("doe");

            expect(messageContent1.equals(messageContent2)).toBe(false);
        });
    });
});
