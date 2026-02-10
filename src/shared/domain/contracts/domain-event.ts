export interface IDomainEvent {
    occurredAt: Date;
    name(): string;
}
