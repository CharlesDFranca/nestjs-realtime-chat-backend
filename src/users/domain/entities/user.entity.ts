import { Entity } from "@/shared/domain/entities/entity";
import { Email } from "../value-objects/email.vo";
import { Password } from "../value-objects/password.vo";
import { Username } from "../value-objects/username.vo";

export class User extends Entity {
    private readonly name: Username;
    private readonly email: Email;
    private readonly password: Password;
}
