import { IUseCase } from "@/shared/app/contracts/use-case";
import { CreateUserDto } from "../dto/create-user.dto";
import { failure, Result, success } from "@/shared/app/results/result";
import { IUserRepository } from "@/users/domain/repositories/user-repository";
import { Email } from "@/users/domain/value-objects/email.vo";
import { ApplicationError } from "@/shared/app/errors/application.error";
import { User } from "@/users/domain/entities/user.entity";
import { IdGenerator } from "@/shared/app/contracts/id-generator";
import { EmailAlreadyUsedError } from "../errors/email-already-used.error";

type CreateUserInput = CreateUserDto;
type CreateUserOutput = { id: string };

export class CreateUserUseCase implements IUseCase<
    CreateUserInput,
    CreateUserOutput
> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly idGenerator: IdGenerator,
    ) {}

    async execute(input: CreateUserInput): Promise<Result<CreateUserOutput>> {
        const alreadyUsed = await this.ensureEmailIsNotUsed(input.email);
        
        if (alreadyUsed) return failure(new EmailAlreadyUsedError(input.email));

        const user = User.create(this.idGenerator.generate(), input);
        await this.userRepository.save(user);

        return success({ id: user.id });
    }

    private async ensureEmailIsNotUsed(raw: string): Promise<boolean> {
        const email = Email.create(raw);
        const alreadyUsed = await this.userRepository.findByEmail(email);

        return !!alreadyUsed;
    }
}
