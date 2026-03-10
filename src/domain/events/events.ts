import type { BikeId, Money } from "../product/types.js";

export type BikePriceUpdated = Readonly<{
  type: "BikePriceUpdated";
  bikeId: BikeId;
  price: Money;
}>;

export type BikeSold = Readonly<{
  type: "BikeSold";
  bikeId: BikeId;
}>;

export type BikeEvent = BikePriceUpdated | BikeSold;
