import type { IUserRepository } from "@/users/domain/repositories/user-repository";
import { DeleteUserUseCase } from "../../delete-user.usecase";

describe("DeleteUserUseCase", () => {
    let userRepository: jest.Mocked<IUserRepository>;
    let useCase: DeleteUserUseCase;

    beforeEach(() => {
        userRepository = {
            delete: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            findByEmail: jest.fn(),
        };

        useCase = new DeleteUserUseCase(userRepository);
    });

    it("should delete user by id and return success", async () => {
        const input = { id: "user-id-123" };

        userRepository.delete.mockResolvedValue(undefined);

        const result = await useCase.execute(input);

        expect(userRepository.delete).toHaveBeenCalledTimes(1);
        expect(userRepository.delete).toHaveBeenCalledWith(input.id);

        expect(result.ok).toBe(true);
        expect(result.value).toBeUndefined();
    });

    it("should not return any value", async () => {
        userRepository.delete.mockResolvedValue(undefined);

        const result = await useCase.execute({ id: "any-id" });

        expect(result.value).toBeUndefined();
    });
});
