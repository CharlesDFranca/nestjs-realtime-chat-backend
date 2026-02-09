import { Entity } from "@/shared/domain/entities/entity";
import { ParticipantRole, Role } from "../value-objects/participant-role.vo";
import { InvalidParticipantRoleError } from "../errors/invalid-participant-role.error";
import { ParticipantName } from "../value-objects/participant-name.vo";

type ParticipantProps = {
    userId: string;
    name: string;
    role: "MEMBER" | "ADMIN";
};

export class Participant extends Entity {
    private _isOnline: boolean = false;
    private _isTyping: boolean = false;

    private constructor(
        id: string,
        private _userId: string,
        private _name: ParticipantName,
        private _role: ParticipantRole,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
    }

    public static create(id: string, props: ParticipantProps): Participant {
        const now = new Date();

        const name = ParticipantName.create(props.name);
        const role = ParticipantRole.create(Role[props.role]);

        return new Participant(id, props.userId, name, role, now, now);
    }

    public get name(): ParticipantName {
        return this._name;
    }

    public get userId(): string {
        return this._userId;
    }

    public get role(): ParticipantRole {
        return this._role;
    }

    public get isOnline(): boolean {
        return this._isOnline;
    }

    public get isTyping(): boolean {
        return this._isTyping;
    }

    public startTyping(): void {
        if (this._isTyping) return;

        this._isTyping = true;
        this.touch();
    }

    public stopTyping(): void {
        if (!this._isTyping) return;

        this._isTyping = false;
        this.touch();
    }

    public changeStatusToOnline(): void {
        if (this._isOnline) return;

        this._isOnline = true;
        this.touch();
    }

    public changeStatusToOffline(): void {
        if (!this._isOnline) return;

        this._isOnline = false;
        this.touch();
    }

    public toAdmin() {
        this.changeRoleTo(Role.ADMIN);
    }

    public toMember() {
        this.changeRoleTo(Role.MEMBER);
    }

    private changeRoleTo(role: Role) {
        if (this._role.is(role)) return;

        switch (role) {
            case Role.MEMBER:
                this._role = this._role.toMember();
                break;

            case Role.ADMIN:
                this._role = this._role.toAdmin();
                break;

            default:
                throw new InvalidParticipantRoleError(role);
        }

        this.touch();
    }
}
