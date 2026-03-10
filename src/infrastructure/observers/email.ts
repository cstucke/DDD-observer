import type { BikeEvent } from "../../domain/events/events.js";
import type { Observer } from "./observer.js";

export function sendEmailMock(event: BikeEvent): void {
  console.log(`[email] send notification for ${event.type}`);
}

export const emailObserver: Observer<BikeEvent> = (event) => {
  sendEmailMock(event);
};
