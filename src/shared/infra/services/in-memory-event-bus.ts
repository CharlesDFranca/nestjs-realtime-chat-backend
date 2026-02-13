import { EventHandler, IEventBus } from "@/shared/app/contracts/event-bus";
import { IDomainEvent } from "@/shared/domain/contracts/domain-event";

export class InMemoryEventBus implements IEventBus {
    private handlers = new Map<string, EventHandler<any>[]>();

    subscribe(eventName: string, handler: EventHandler<any>): void {
        const existing = this.handlers.get(eventName) ?? [];

        this.handlers.set(eventName, [...existing, handler]);
    }

    async publish(events: IDomainEvent[]): Promise<void> {
        for (const event of events) {
            const eventName = event.eventName();
            const handlers = this.handlers.get(eventName) ?? [];

            for (const handler of handlers) {
                handler.handle(event);
            }
        }
    }
}
