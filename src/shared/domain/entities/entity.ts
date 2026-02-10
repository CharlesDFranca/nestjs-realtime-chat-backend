import { IDomainEvent } from "../contracts/domain-event";
import { InvalidEntityDateError } from "../errors/invalid-entity-date.error";

export abstract class Entity {
    private readonly _domainEvents: IDomainEvent[] = [];

    constructor(
        private readonly _id: string,
        private readonly _createdAt: Date,
        private _updatedAt: Date,
    ) {
        if (_createdAt.getTime() > _updatedAt.getTime())
            throw new InvalidEntityDateError(_createdAt, _updatedAt);
    }

    protected addDomainEvent(event: IDomainEvent) {
        this._domainEvents.push(event);
    }

    protected pullDomainEvents(): IDomainEvent[] {
        const events: IDomainEvent[] = [...this._domainEvents];
        this._domainEvents.length = 0;
        return events;
    }

    public get id(): string {
        return this._id;
    }
    public get createdAt(): Date {
        return new Date(this._createdAt);
    }
    public get updatedAt(): Date {
        return new Date(this._updatedAt);
    }

    protected touch(): void {
        this._updatedAt = new Date();
    }

    public equals(other: Entity): boolean {
        if (!other) return false;

        return this.id === other.id;
    }
}
