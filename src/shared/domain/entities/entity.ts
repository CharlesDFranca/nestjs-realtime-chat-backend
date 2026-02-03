import { InvalidEntityDateError } from "../errors/invalid-entity-date.error";

export abstract class Entity {
    constructor(
        private readonly _id: string,
        private readonly _createdAt: Date,
        private _updatedAt: Date,
    ) {
        if (_createdAt.getTime() > _updatedAt.getTime())
            throw new InvalidEntityDateError(_createdAt, _updatedAt);
    }

    public get id(): string { return this._id; }
    public get createdAt(): Date { return new Date(this._createdAt); }
    public get updatedAt(): Date { return new Date(this._updatedAt); }

    protected touch(): void { this._updatedAt = new Date(); }

    public equals(other: Entity): boolean {
        if (!other) return false;

        return this.id === other.id;
    }
}