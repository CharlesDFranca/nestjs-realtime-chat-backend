import { Email } from "../value-objects/email.vo";
import { Username } from "../value-objects/username.vo";

export class User {
    private readonly id: string;
    private readonly name: Username;
    private readonly email: Email;
    private readonly password: string;
    private readonly createdAt: Date;
    private readonly updatedAt: Date;
}
