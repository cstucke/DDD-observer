import type { BikeEvent } from "../events/events.js";
import type {
  BikeId,
  BikeModel,
  CustomerEmail,
  Money,
  Price,
} from "./types.js";
import type { Observer } from "../../infrastructure/observers/observer.js";

export type Order = {
  id: string;
  customerName: string;
  customerEmail: CustomerEmail;
  bicycleModel: BikeModel;
  price: Price;
  quantity: number;
  expressAssembly: boolean;
  total: Price;
};

export type Bike = Readonly<{
  id: BikeId;
  model: BikeModel;
  price: Money;
  isSold: boolean;
  observers: readonly Observer<BikeEvent>[];
}>;

export function printBikeSummary(bike: Bike): void {
  console.log(
    `Bike ${bike.id}: ${bike.model} costs ${bike.price.amount} ${bike.price.currency} and sold=${bike.isSold}`,
  );
}

export function printOrderSummary(order: Order): void {
  console.log(
    `${order.customerName} ordered ${order.quantity} x ${order.bicycleModel} for $${order.total}`,
  );
}
