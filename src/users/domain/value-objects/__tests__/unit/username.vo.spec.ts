import { Username } from "../../username.vo";

describe("Username Value Object", () => {
    describe("creation", () => {
        it("should create a valid username", () => {
            const username = Username.create("john_doe");

            expect(username.value).toBe("john_doe");
        });

        it("should trim whitespace from username", () => {
            const username = Username.create("   john_doe   ");

            expect(username.value).toBe("john_doe");
        });
    });

    describe("validation", () => {
        it("should throw if username is empty", () => {
            expect(() => {
                Username.create("");
            }).toThrow("The username cannot be empty.");
        });

        it("should throw if username is only whitespace", () => {
            expect(() => {
                Username.create("   ");
            }).toThrow("The username cannot be empty.");
        });

        it("should throw if username is a number", () => {
            expect(() => {
                Username.create("12345");
            }).toThrow("The username cannot be a number.");
        });

        it("should throw if username exceeds 255 characters", () => {
            const longUsername = "a".repeat(256);

            expect(() => {
                Username.create(longUsername);
            }).toThrow("The username cannot exceed 255 characters.");
        });
    });

    describe("equality", () => {
        it("should consider usernames with same value as equal", () => {
            const username1 = Username.create("john");
            const username2 = Username.create("john");

            expect(username1.equals(username2)).toBe(true);
        });

        it("should consider usernames with different values as not equal", () => {
            const username1 = Username.create("john");
            const username2 = Username.create("doe");

            expect(username1.equals(username2)).toBe(false);
        });
    });
});
