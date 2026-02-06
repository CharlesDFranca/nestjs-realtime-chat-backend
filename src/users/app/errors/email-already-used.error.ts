import { ApplicationError } from "@/shared/app/errors/application.error";

export class EmailAlreadyUsedError extends ApplicationError {
    code = "EMAIL_ALREADY_USED";

    constructor(email: string) {
        super(`Email already in use: ${email}`);
    }
}
