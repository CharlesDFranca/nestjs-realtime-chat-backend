import { Username } from "../value-objects/username.vo";

export class User {
    private readonly id: string;
    private readonly name: Username;
    private readonly email: string;
    private readonly password: string;
    private readonly createdAt: Date;
    private readonly updatedAt: Date;
}
