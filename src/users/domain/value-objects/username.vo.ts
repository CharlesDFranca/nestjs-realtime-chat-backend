import { ValueObject } from "@/shared/domain/value-object/value-object.vo";

export class Username extends ValueObject<string> {
    public static create(value: string) {
        return new Username(value.trim());
    }

    protected validate(value: string): void {
        if (!value) throw new Error("The username cannot be empty.");
        if (!isNaN(Number(value)))
            throw new Error("The username cannot be a number.");
        if (value.length > 255)
            throw new Error("The username cannot exceed 255 characters.");
    }
}
