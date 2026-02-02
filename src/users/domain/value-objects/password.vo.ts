import { ValueObject } from "@/shared/domain/value-object/value-object.vo";

export class Password extends ValueObject<string> {
    private static MIN_LENGTH = 8;
    private static MAX_LENGTH = 72;

    public static create(value: string): Password {
        return new Password(value.trim());
    }

    protected validate(value: string): void {
        if (!value) throw new Error("Password cannot be empty.");

        if (value.length < Password.MIN_LENGTH)
            throw new Error("Password must be at least 8 characters long.");

        if (value.length > Password.MAX_LENGTH)
            throw new Error("Password cannot exceed 72 characters.");

        if (!/\d/.test(value))
            throw new Error("Password must contain at least one number.");
    }
}
