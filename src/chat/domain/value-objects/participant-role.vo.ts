import { ValueObject } from "@/shared/domain/value-object/value-object.vo";
import { InvalidParticipantRoleError } from "../errors/invalid-participant-role.error";

export enum Role {
    MEMBER = "MEMBER",
    ADMIN = "ADMIN",
}

export class ParticipantRole extends ValueObject<Role> {
    static create(value: Role): ParticipantRole {
        return new ParticipantRole(value);
    }

    protected validate(value: Role): void {
        if (!Object.values(Role).includes(value))
            throw new InvalidParticipantRoleError(value);
    }

    public toAdmin(): ParticipantRole {
        return ParticipantRole.create(Role.ADMIN);
    }

    public toMember(): ParticipantRole {
        return ParticipantRole.create(Role.MEMBER);
    }

    public is(role: Role): boolean {
        if (!role) return false;

        return this.value === role;
    }
}
