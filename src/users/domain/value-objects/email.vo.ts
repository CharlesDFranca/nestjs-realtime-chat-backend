import { ValueObject } from "@/shared/domain/value-object/value-object.vo";

export class Email extends ValueObject<string> {
    public static create(value: string) {
        const formatted = value.trim().toLocaleLowerCase();
        return new Email(formatted);
    }

    protected validate(value: string): void {
        if (!value) throw new Error("Email cannot be empty.");

        if (value.length > 255)
            throw new Error("Email cannot exceed 255 characters.");

        if (!Email.isValidEmail(value)) {
            throw new Error("Invalid email format.");
        }
    }

    private static isValidEmail(value: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }
}
