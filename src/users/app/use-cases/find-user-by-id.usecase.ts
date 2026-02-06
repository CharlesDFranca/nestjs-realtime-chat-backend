import { IUseCase } from "@/shared/app/contracts/use-case";
import { failure, Result, success } from "@/shared/app/results/result";
import type { IUserRepository } from "@/users/domain/repositories/user-repository";
import { Injectable } from "@nestjs/common";
import { UserNotFoundError } from "../errors/user-not-found.error";

type FindUserByIdInput = { id: string };
type FindUserByIdOutput = { name: string; email: string };

@Injectable()
export class FindUserByIdUseCase implements IUseCase<
    FindUserByIdInput,
    FindUserByIdOutput
> {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(
        input: FindUserByIdInput,
    ): Promise<Result<FindUserByIdOutput>> {
        const user = await this.userRepository.findById(input.id);

        if (!user) return failure(new UserNotFoundError());

        return success({
            name: user.name.value,
            email: user.email.value,
        });
    }
}
