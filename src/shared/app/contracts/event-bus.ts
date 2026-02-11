import { IDomainEvent } from "@/shared/domain/contracts/domain-event";

export interface EventHandler<E extends IDomainEvent> {
    handle(event: E): Promise<void>;
}

export interface IEventBus {
    subscribe<E extends IDomainEvent>(
        eventName: string,
        handler: EventHandler<E>,
    ): void;
    publish(events: IDomainEvent[]): Promise<void>;
}
