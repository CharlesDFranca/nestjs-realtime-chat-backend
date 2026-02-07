import type { IUserRepository } from "@/users/domain/repositories/user-repository";
import type { IdGenerator } from "@/shared/app/contracts/id-generator";
import { Email } from "@/users/domain/value-objects/email.vo";
import { User } from "@/users/domain/entities/user.entity";
import { CreateUserUseCase } from "../../create-user.usecase";
import { EmailAlreadyUsedError } from "@/users/app/errors/email-already-used.error";
import { ApplicationError } from "@/shared/app/errors/application.error";

describe("CreateUserUseCase", () => {
    let userRepository: jest.Mocked<IUserRepository>;
    let idGenerator: jest.Mocked<IdGenerator>;
    let useCase: CreateUserUseCase;

    beforeEach(() => {
        userRepository = {
            save: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
            delete: jest.fn(),
        };

        idGenerator = {
            generate: jest.fn(),
        };

        useCase = new CreateUserUseCase(userRepository, idGenerator);
    });

    it("should create a user successfully when email is not used", async () => {
        const input = {
            name: "John Doe",
            email: "john.doe@email.com",
            password: "StrongPass123!",
        };

        idGenerator.generate.mockReturnValue("user-id-123");
        userRepository.findByEmail.mockResolvedValue(null);

        const result = await useCase.execute(input);

        expect(result.ok).toBe(true);
        expect(result.value).toEqual({ id: "user-id-123" });

        expect(idGenerator.generate).toHaveBeenCalledTimes(1);
        expect(userRepository.findByEmail).toHaveBeenCalledWith(
            Email.create(input.email),
        );
        expect(userRepository.save).toHaveBeenCalledTimes(1);
        expect(userRepository.save).toHaveBeenCalledWith(expect.any(User));
    });

    it("should return failure if email is already used", async () => {
        const input = {
            name: "John Doe",
            email: "john.doe@email.com",
            password: "StrongPass123!",
        };

        userRepository.findByEmail.mockResolvedValue({} as User);

        const result = await useCase.execute(input);

        expect(result.ok).toBe(false);
        expect(result.value).toBeInstanceOf(EmailAlreadyUsedError);
        expect((result.value as ApplicationError).message).toContain(
            input.email,
        );

        expect(idGenerator.generate).not.toHaveBeenCalled();
        expect(userRepository.save).not.toHaveBeenCalled();
    });

    it("should not save user if email is already used", async () => {
        const input = {
            name: "Jane Doe",
            email: "jane@email.com",
            password: "StrongPass123!",
        };

        userRepository.findByEmail.mockResolvedValue({} as User);

        await useCase.execute(input);

        expect(userRepository.save).not.toHaveBeenCalled();
    });

    it("should generate id using IdGenerator", async () => {
        const input = {
            name: "John Doe",
            email: "john@email.com",
            password: "StrongPass123!",
        };

        idGenerator.generate.mockReturnValue("generated-id");
        userRepository.findByEmail.mockResolvedValue(null);

        await useCase.execute(input);

        expect(idGenerator.generate).toHaveBeenCalledTimes(1);
    });
});
