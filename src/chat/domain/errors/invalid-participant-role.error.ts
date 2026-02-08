import { Role } from "../value-objects/participant-role.vo";

export class InvalidParticipantRoleError extends Error {
    constructor(role: Role) {
        const roleName = Role[role] ?? String(role);

        super(`${roleName} is not a valid role`);
    }
}
