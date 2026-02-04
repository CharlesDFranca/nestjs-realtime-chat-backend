import { Entity } from "@/shared/domain/entities/entity";
import { Email } from "../value-objects/email.vo";
import { Password } from "../value-objects/password.vo";
import { Username } from "../value-objects/username.vo";

export class User extends Entity {
    private readonly _name: Username;
    private readonly _email: Email;
    private readonly _password: Password;

    public get name(): Username {
        return this._name;
    }

    public get email(): Email {
        return this._email;
    }

    public get password(): Password {
        return this._password;
    }
}
