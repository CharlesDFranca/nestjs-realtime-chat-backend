import { ParticipantName } from "../../participant-name.vo";

describe("ParticipantName Value Object", () => {
    describe("creation", () => {
        it("should create a valid participant name", () => {
            const participantName = ParticipantName.create("john_doe");

            expect(participantName.value).toBe("john_doe");
        });

        it("should trim whitespace from participant name", () => {
            const participantName = ParticipantName.create("   john_doe   ");

            expect(participantName.value).toBe("john_doe");
        });
    });

    describe("validation", () => {
        it("should throw if participant name is empty", () => {
            expect(() => {
                ParticipantName.create("");
            }).toThrow("The participant name cannot be empty.");
        });

        it("should throw if participant name is only whitespace", () => {
            expect(() => {
                ParticipantName.create("   ");
            }).toThrow("The participant name cannot be empty.");
        });

        it("should throw if participant name is a number", () => {
            expect(() => {
                ParticipantName.create("12345");
            }).toThrow("The participant name cannot be a number.");
        });

        it("should throw if participant name exceeds 255 characters", () => {
            const longParticipantName = "a".repeat(256);

            expect(() => {
                ParticipantName.create(longParticipantName);
            }).toThrow("The participant name cannot exceed 255 characters.");
        });
    });

    describe("equality", () => {
        it("should consider participant name with same value as equal", () => {
            const participantName1 = ParticipantName.create("john");
            const participantName2 = ParticipantName.create("john");

            expect(participantName1.equals(participantName2)).toBe(true);
        });

        it("should consider participant name with different values as not equal", () => {
            const participantName1 = ParticipantName.create("john");
            const participantName2 = ParticipantName.create("doe");

            expect(participantName1.equals(participantName2)).toBe(false);
        });
    });
});
