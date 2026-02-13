export interface IDomainEvent {
    occurredAt: Date;
    eventName(): string;
}
