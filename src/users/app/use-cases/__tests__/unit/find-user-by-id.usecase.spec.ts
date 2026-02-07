import type { IUserRepository } from "@/users/domain/repositories/user-repository";
import { FindUserByIdUseCase } from "../../find-user-by-id.usecase";
import { UserNotFoundError } from "@/users/app/errors/user-not-found.error";

describe("FindUserByIdUseCase", () => {
    let userRepository: jest.Mocked<IUserRepository>;
    let useCase: FindUserByIdUseCase;

    beforeEach(() => {
        userRepository = {
            findById: jest.fn(),
            save: jest.fn(),
            findByEmail: jest.fn(),
            delete: jest.fn(),
        };

        useCase = new FindUserByIdUseCase(userRepository);
    });

    it("should return user data when user exists", async () => {
        const input = { id: "user-id-123" };

        const user = {
            name: { value: "John Doe" },
            email: { value: "john.doe@email.com" },
        };

        userRepository.findById.mockResolvedValue(user as any);

        const result = await useCase.execute(input);

        expect(result.ok).toBe(true);
        expect(result.value).toEqual({
            name: "John Doe",
            email: "john.doe@email.com",
        });

        expect(userRepository.findById).toHaveBeenCalledTimes(1);
        expect(userRepository.findById).toHaveBeenCalledWith(input.id);
    });

    it("should return failure when user is not found", async () => {
        const input = { id: "non-existing-id" };

        userRepository.findById.mockResolvedValue(null);

        const result = await useCase.execute(input);

        expect(result.ok).toBe(false);
        expect(result.value).toBeInstanceOf(UserNotFoundError);

        expect(userRepository.findById).toHaveBeenCalledWith(input.id);
    });
});
