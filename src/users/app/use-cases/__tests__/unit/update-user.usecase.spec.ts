import type { IUserRepository } from "@/users/domain/repositories/user-repository";
import { Email } from "@/users/domain/value-objects/email.vo";
import { UpdateUserUseCase } from "../../update-user.usecase";
import { UserNotFoundError } from "@/users/app/errors/user-not-found.error";
import { EmailAlreadyUsedError } from "@/users/app/errors/email-already-used.error";

describe("UpdateUserUseCase", () => {
    let userRepository: jest.Mocked<IUserRepository>;
    let useCase: UpdateUserUseCase;

    const makeUser = (overrides?: Partial<any>) => {
        const email = Email.create("old@email.com");

        return {
            name: { value: "Old Name" },
            email,
            changeName: jest.fn(function (this: any, name: string) {
                this.name.value = name;
            }),
            changeEmail: jest.fn(function (this: any, value: string) {
                this.email = Email.create(value);
            }),
            ...overrides,
        };
    };

    beforeEach(() => {
        userRepository = {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
        };

        useCase = new UpdateUserUseCase(userRepository);
    });

    it("should return failure if user is not found", async () => {
        // arrange
        userRepository.findById.mockResolvedValue(null);

        // act
        const result = await useCase.execute({ id: "invalid-id" });

        // assert
        expect(result.ok).toBe(false);
        expect(result.value).toBeInstanceOf(UserNotFoundError);

        expect(userRepository.save).not.toHaveBeenCalled();
    });

    it("should update only the name", async () => {
        // arrange
        const user = makeUser();

        userRepository.findById.mockResolvedValue(user as any);

        // act
        const result = await useCase.execute({
            id: "user-id",
            name: "New Name",
        });

        // assert
        expect(user.changeName).toHaveBeenCalledWith("New Name");
        expect(user.changeEmail).not.toHaveBeenCalled();

        expect(userRepository.save).toHaveBeenCalledWith(user);

        expect(result.ok).toBe(true);
        expect(result.value).toEqual({
            name: "New Name",
            email: "old@email.com",
        });
    });

    it("should update email when email is different and not used", async () => {
        // arrange
        const user = makeUser();

        userRepository.findById.mockResolvedValue(user as any);
        userRepository.findByEmail.mockResolvedValue(null);

        // act
        const result = await useCase.execute({
            id: "user-id",
            email: "new@email.com",
        });

        // assert
        expect(userRepository.findByEmail).toHaveBeenCalledWith(
            Email.create("new@email.com"),
        );
        expect(user.changeEmail).toHaveBeenCalledWith("new@email.com");

        expect(userRepository.save).toHaveBeenCalledWith(user);

        expect(result.value).toEqual({
            name: "Old Name",
            email: "new@email.com",
        });
    });

    it("should not check duplicated email if email is the same", async () => {
        // arrange
        const email = Email.create("same@email.com");
        const user = makeUser({ email });

        userRepository.findById.mockResolvedValue(user as any);

        // act
        await useCase.execute({
            id: "user-id",
            email: "same@email.com",
        });

        // assert
        expect(userRepository.findByEmail).not.toHaveBeenCalled();
        expect(user.changeEmail).not.toHaveBeenCalled();

        expect(userRepository.save).toHaveBeenCalledWith(user);
    });

    it("should return failure if new email is already used", async () => {
        // arrange
        const user = makeUser();

        userRepository.findById.mockResolvedValue(user as any);
        userRepository.findByEmail.mockResolvedValue({} as any);

        // act
        const result = await useCase.execute({
            id: "user-id",
            email: "used@email.com",
        });

        // assert
        expect(result.ok).toBe(false);
        expect(result.value).toBeInstanceOf(EmailAlreadyUsedError);

        expect(user.changeEmail).not.toHaveBeenCalled();
        expect(userRepository.save).not.toHaveBeenCalled();
    });

    it("should update name and email together", async () => {
        // arrange
        const user = makeUser();

        userRepository.findById.mockResolvedValue(user as any);
        userRepository.findByEmail.mockResolvedValue(null);

        // act
        const result = await useCase.execute({
            id: "user-id",
            name: "New Name",
            email: "new@email.com",
        });

        // assert
        expect(user.changeName).toHaveBeenCalledWith("New Name");
        expect(user.changeEmail).toHaveBeenCalledWith("new@email.com");

        expect(userRepository.save).toHaveBeenCalledWith(user);

        expect(result.value).toEqual({
            name: "New Name",
            email: "new@email.com",
        });
    });
});
