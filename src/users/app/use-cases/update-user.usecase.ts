import { IUseCase } from "@/shared/app/contracts/use-case";
import { failure, Result, success } from "@/shared/app/results/result";
import type { IUserRepository } from "@/users/domain/repositories/user-repository";
import { Injectable } from "@nestjs/common";
import { UserNotFoundError } from "../errors/user-not-found.error";
import { Email } from "@/users/domain/value-objects/email.vo";
import { EmailAlreadyUsedError } from "../errors/email-already-used.error";

type UpdateUserInput = {
    id: string;
    name?: string;
    email?: string;
};
type UpdateUserOutput = {
    name: string;
    email: string;
};

@Injectable()
export class UpdateUserUseCase implements IUseCase<
    UpdateUserInput,
    UpdateUserOutput
> {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(input: UpdateUserInput): Promise<Result<UpdateUserOutput>> {
        const user = await this.userRepository.findById(input.id);

        if (!user) return failure(new UserNotFoundError());

        if (input.email) {
            const email = Email.create(input.email);

            if (!user.email.equals(email)) {
                const alreadyUsed =
                    await this.userRepository.findByEmail(email);

                if (alreadyUsed)
                    return failure(new EmailAlreadyUsedError(input.email));

                user.changeEmail(email.value);
            }
        }

        if (input.name) user.changeName(input.name);

        await this.userRepository.save(user);

        return success({
            name: user.name.value,
            email: user.email.value,
        });
    }
}
