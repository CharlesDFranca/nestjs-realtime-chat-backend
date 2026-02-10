import { ValueObject } from "@/shared/domain/value-object/value-object.vo";

export class MessageContent extends ValueObject<string> {
    private static MAX_LENGTH = 5000;

    public static create(value: string) {
        return new MessageContent(value.trim());
    }

    protected validate(value: string): void {
        if (!value) throw new Error("The message content cannot be empty.");

        if (value.length > MessageContent.MAX_LENGTH)
            throw new Error(
                "The message content cannot exceed 5000 characters.",
            );
    }
}
