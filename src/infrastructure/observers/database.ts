import type { BikeEvent } from "../../domain/events/events.js";
import type { Observer } from "./observer.js";

export function saveToDatabaseMock(event: BikeEvent): void {
  console.log(`[audit] received ${event.type} for bike ${event.bikeId}`);
}

export const auditObserver: Observer<BikeEvent> = (event) => {
  saveToDatabaseMock(event);
};
