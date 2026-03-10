import type { BikeEvent } from "../../domain/events/events.js";
import type { Bike } from "../../domain/product/product.js";

export type Observer<T> = (event: T) => void;

export function subscribe(
  bike: Bike,
  observer: Observer<BikeEvent>,
): Bike {
  return Object.freeze({
    ...bike,
    observers: Object.freeze([...bike.observers, observer]),
  });
}

export function unsubscribe(
  bike: Bike,
  observer: Observer<BikeEvent>,
): Bike {
  return Object.freeze({
    ...bike,
    observers: Object.freeze(
      bike.observers.filter((registeredObserver) => registeredObserver !== observer),
    ),
  });
}

export function notify(bike: Bike, event: BikeEvent): void {
  bike.observers.forEach((observer) => {
    observer(event);
  });
}
