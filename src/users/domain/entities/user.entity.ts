import { Entity } from "@/shared/domain/entities/entity";
import { Email } from "../value-objects/email.vo";
import { Password } from "../value-objects/password.vo";
import { Username } from "../value-objects/username.vo";

type UserProps = {
    name: string;
    email: string;
    password: string;
};

export class User extends Entity {
    private _name: Username;
    private _email: Email;
    private _password: Password;

    private constructor(
        _id: string,
        name: Username,
        email: Email,
        password: Password,
        _createdAt: Date,
        _updatedAt: Date,
    ) {
        super(_id, _createdAt, _updatedAt);
        this._name = name;
        this._email = email;
        this._password = password;
    }

    static create(id: string, props: UserProps): User {
        const username = Username.create(props.name);
        const email = Email.create(props.email);
        const password = Password.create(props.password);

        const now = new Date();

        return new User(id, username, email, password, now, now);
    }

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
