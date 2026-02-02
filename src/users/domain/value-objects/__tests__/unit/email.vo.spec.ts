import { Email } from "../../email.vo";

describe("Email Value Object", () => {
    describe("creation & normalization", () => {
        it("should create a valid email", () => {
            const sut = Email.create("john.doe@gmail.com");

            expect(sut.value).toBe("john.doe@gmail.com");
        });

        it("should trim whitespace from email", () => {
            const sut = Email.create("   john.doe@gmail.com   ");

            expect(sut.value).toBe("john.doe@gmail.com");
        });

        it("should convert email to lowercase", () => {
            const sut = Email.create("John.Doe@GMAIL.COM");

            expect(sut.value).toBe("john.doe@gmail.com");
        });

        it("should trim and lowercase email at the same time", () => {
            const sut = Email.create("   John.Doe@GMAIL.COM   ");

            expect(sut.value).toBe("john.doe@gmail.com");
        });
    });

    describe("validation", () => {
        it("should throw if email is empty", () => {
            expect(() => {
                Email.create("");
            }).toThrow("Email cannot be empty.");
        });

        it("should throw if email is only whitespace", () => {
            expect(() => {
                Email.create("   ");
            }).toThrow("Email cannot be empty.");
        });

        it("should throw if email exceeds 255 characters", () => {
            const localPart = "a".repeat(250);
            const longEmail = `${localPart}@gmail.com`; // > 255 chars

            expect(() => {
                Email.create(longEmail);
            }).toThrow("Email cannot exceed 255 characters.");
        });

        it("should throw if email format is invalid", () => {
            const invalidEmails = [
                "plainaddress",
                "@gmail.com",
                "john@",
                "john@gmail",
                "john gmail.com",
                "john@.com",
            ];

            invalidEmails.forEach((email) => {
                expect(() => Email.create(email)).toThrow(
                    "Invalid email format.",
                );
            });
        });
    });

    describe("equality", () => {
        it("should consider emails with same value as equal", () => {
            const email1 = Email.create("john.doe@gmail.com");
            const email2 = Email.create("JOHN.DOE@gmail.com");

            expect(email1.equals(email2)).toBe(true);
        });

        it("should consider emails with different values as not equal", () => {
            const email1 = Email.create("john.doe@gmail.com");
            const email2 = Email.create("jane.doe@gmail.com");

            expect(email1.equals(email2)).toBe(false);
        });
    });
});
