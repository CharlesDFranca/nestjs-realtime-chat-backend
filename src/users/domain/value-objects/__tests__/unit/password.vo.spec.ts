import { Password } from "../../password.vo";

describe("Password Value Object", () => {
    describe("creation & normalization", () => {
        it("should create a valid password", () => {
            const sut = Password.create("password1");

            expect(sut.value).toBe("password1");
        });

        it("should trim whitespace from password", () => {
            const sut = Password.create("   password1   ");

            expect(sut.value).toBe("password1");
        });
    });

    describe("validation", () => {
        it("should throw if password is empty", () => {
            expect(() => {
                Password.create("");
            }).toThrow("Password cannot be empty.");
        });

        it("should throw if password is only whitespace", () => {
            expect(() => {
                Password.create("   ");
            }).toThrow("Password cannot be empty.");
        });

        it("should throw if password is shorter than 8 characters", () => {
            expect(() => {
                Password.create("pass1");
            }).toThrow("Password must be at least 8 characters long.");
        });

        it("should throw if password exceeds 72 characters", () => {
            const longPassword = "a".repeat(72) + "1";

            expect(() => {
                Password.create(longPassword);
            }).toThrow("Password cannot exceed 72 characters.");
        });

        it("should throw if password does not contain a number", () => {
            expect(() => {
                Password.create("password");
            }).toThrow("Password must contain at least one number.");
        });
    });

    describe("equality", () => {
        it("should consider passwords with same value as equal", () => {
            const password1 = Password.create("password1");
            const password2 = Password.create("password1");

            expect(password1.equals(password2)).toBe(true);
        });

        it("should consider passwords with different values as not equal", () => {
            const password1 = Password.create("password1");
            const password2 = Password.create("password2");

            expect(password1.equals(password2)).toBe(false);
        });
    });
});
