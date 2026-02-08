import { ValueObject } from "@/shared/domain/value-object/value-object.vo";

export class ParticipantName extends ValueObject<string> {
    private static MAX_LENGTH = 255;

    public static create(value: string) {
        return new ParticipantName(value.trim());
    }

    protected validate(value: string): void {
        if (!value) throw new Error("The participant name cannot be empty.");

        if (!isNaN(Number(value)))
            throw new Error("The participant name cannot be a number.");

        if (value.length > ParticipantName.MAX_LENGTH)
            throw new Error("The participant name cannot exceed 255 characters.");
    }
}
