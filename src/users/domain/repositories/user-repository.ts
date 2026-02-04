import { User } from "../entities/user.entity";
import { Email } from "../value-objects/email.vo";

export interface IUserRepository {
    save(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: Email): Promise<User | null>;
    delete(id: string): Promise<void>;
}
