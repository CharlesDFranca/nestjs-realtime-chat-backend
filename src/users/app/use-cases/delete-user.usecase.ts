import { IUseCase } from "@/shared/app/contracts/use-case";
import { Result, success } from "@/shared/app/results/result";
import type { IUserRepository } from "@/users/domain/repositories/user-repository";
import { Injectable } from "@nestjs/common";

type DeleteUserInput = { id: string };

@Injectable()
export class DeleteUserUseCase implements IUseCase<DeleteUserInput, void> {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(input: DeleteUserInput): Promise<Result<void>> {
        await this.userRepository.delete(input.id);
        return success(undefined);
    }
}
