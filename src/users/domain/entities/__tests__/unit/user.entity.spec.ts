import { Email } from "@/users/domain/value-objects/email.vo";
import { Password } from "@/users/domain/value-objects/password.vo";
import { Username } from "@/users/domain/value-objects/username.vo";
import { User } from "../../user.entity";

describe("User Entity", () => {
    const validProps = {
        name: "john_doe",
        email: "john@email.com",
        password: "StrongPassword123!",
    };

    const userId = "user-id-123";

    describe("creation", () => {
        it("should create a user with valid value objects", () => {
            const user = User.create(userId, validProps);

            expect(user).toBeInstanceOf(User);
            expect(user.name).toBeInstanceOf(Username);
            expect(user.email).toBeInstanceOf(Email);
            expect(user.password).toBeInstanceOf(Password);
        });

        it("should initialize createdAt and updatedAt with the same value", () => {
            const user = User.create(userId, validProps);

            expect(user.createdAt.getTime()).toBe(user.updatedAt.getTime());
        });

        it("should throw if name is invalid", () => {
            expect(() =>
                User.create(userId, {
                    ...validProps,
                    name: "",
                }),
            ).toThrow();
        });

        it("should throw if email is invalid", () => {
            expect(() =>
                User.create(userId, {
                    ...validProps,
                    email: "invalid-email",
                }),
            ).toThrow();
        });

        it("should throw if password is invalid", () => {
            expect(() =>
                User.create(userId, {
                    ...validProps,
                    password: "123",
                }),
            ).toThrow();
        });
    });

    describe("changeName", () => {
        it("should change user name and update updatedAt", async () => {
            const user = User.create(userId, validProps);
            const previousUpdatedAt = user.updatedAt.getTime();

            await new Promise((r) => setTimeout(r, 5));

            user.changeName("new_name");

            expect(user.name.value).toBe("new_name");
            expect(user.updatedAt.getTime()).toBeGreaterThan(previousUpdatedAt);
        });

        it("should throw if new name is invalid", () => {
            const user = User.create(userId, validProps);

            expect(() => user.changeName("")).toThrow();
        });
    });

    describe("changeEmail", () => {
        it("should change email and update updatedAt", async () => {
            const user = User.create(userId, validProps);
            const previousUpdatedAt = user.updatedAt.getTime();

            await new Promise((r) => setTimeout(r, 5));

            user.changeEmail("new@email.com");

            expect(user.email.value).toBe("new@email.com");
            expect(user.updatedAt.getTime()).toBeGreaterThan(previousUpdatedAt);
        });

        it("should throw if new email is invalid", () => {
            const user = User.create(userId, validProps);

            expect(() => user.changeEmail("invalid-email")).toThrow();
        });
    });

    describe("changePassword", () => {
        it("should change password and update updatedAt", async () => {
            const user = User.create(userId, validProps);
            const previousUpdatedAt = user.updatedAt.getTime();

            await new Promise((r) => setTimeout(r, 5));

            user.changePassword("AnotherStrongPass123!");

            expect(user.password).toBeInstanceOf(Password);
            expect(user.updatedAt.getTime()).toBeGreaterThan(previousUpdatedAt);
        });

        it("should throw if new password is invalid", () => {
            const user = User.create(userId, validProps);

            expect(() => user.changePassword("123")).toThrow();
        });
    });
});
