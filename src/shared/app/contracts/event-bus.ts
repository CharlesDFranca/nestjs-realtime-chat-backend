import { IDomainEvent } from "@/shared/domain/contracts/domain-event";

export type EventHandler<T extends IDomainEvent> = (event: T) => void;

export interface IEventBus {
    subscribe<T extends IDomainEvent>(
        eventName: string,
        handler: EventHandler<T>,
    ): void;
    publish(events: IDomainEvent[]): void;
}
