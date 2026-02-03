export class InvalidEntityDateError extends Error {
    constructor(createdAt: Date, updatedAt: Date) {
        super(
            `Invalid entity dates: createdAt: (${createdAt.toISOString()}) is after updatedAt: (${updatedAt.toISOString()})`,
        );
    }
}
