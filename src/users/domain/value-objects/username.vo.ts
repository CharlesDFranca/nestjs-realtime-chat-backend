import { ValueObject } from "@/shared/domain/value-object/value-object.vo";

export class Username extends ValueObject<string> {
    private static MAX_LENGTH = 255;

    public static create(value: string) {
        return new Username(value.trim());
    }

    protected validate(value: string): void {
        if (!value) throw new Error("The username cannot be empty.");

        if (!isNaN(Number(value)))
            throw new Error("The username cannot be a number.");

        if (value.length > Username.MAX_LENGTH)
            throw new Error("The username cannot exceed 255 characters.");
    }
}
