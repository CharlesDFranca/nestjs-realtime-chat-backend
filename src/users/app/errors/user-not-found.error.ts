import { ApplicationError } from "@/shared/app/errors/application.error";

export class UserNotFoundError extends ApplicationError {
    code = "USER_NOT_FOUND";

    constructor() {
        super("User not found.");
    }
}
