import { v4 as uuidv4 } from "uuid";

import type { BikeEvent } from "../events/events.js";
import type { Bike, Order } from "./product.js";
import type {
  BikeId,
  BikeModel,
  Currency,
  CustomerEmail,
  Money,
  Price,
} from "./types.js";
import { notify } from "../../infrastructure/observers/observer.js";

export function createPrice(price: number): Price {
  if (price < 0) {
    throw new Error(`invalid price!`);
  }
  return price as Price;
}

export function createEmail(email: string): CustomerEmail {
  if (!email.includes(`@`)) {
    throw new Error(`invalid email!`);
  }
  return email as CustomerEmail;
}

export function createBikeModel(bike: string): BikeModel {
  if (bike.length === 0) {
    throw new Error(`invalid Bike name`);
  }
  return bike as BikeModel;
}

export function createCurrency(currency: string): Currency {
  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new Error(`invalid currency code`);
  }
  return currency as Currency;
}

export function createMoney(amount: number, currency: string): Money {
  return Object.freeze({
    amount: createPrice(amount),
    currency: createCurrency(currency),
  });
}

export function addMoney(moneyA: Money, moneyB: Money): Money {
  if (moneyA.currency !== moneyB.currency) {
    throw new Error(`cannot add money with different currencies`);
  }
  return createMoney(moneyA.amount + moneyB.amount, moneyA.currency);
}

export function updateMoneyAmount(money: Money, newAmount: number): Money {
  return createMoney(newAmount, money.currency);
}

export function createBikeId(): BikeId {
  return uuidv4() as BikeId;
}

export function createBike(model: BikeModel, price: Money): Bike {
  return Object.freeze({
    id: createBikeId(),
    model,
    price,
    isSold: false,
    observers: Object.freeze([]),
  });
}

export function createOrder(
  customerName: string,
  customerEmail: CustomerEmail,
  bicycleModel: BikeModel,
  price: Price,
  quantity: number,
  expressAssembly: boolean,
): Order {
  const total = createPrice(price * quantity + (expressAssembly ? 75 : 0));

  return {
    id: uuidv4(),
    customerName,
    customerEmail,
    bicycleModel,
    price,
    quantity,
    expressAssembly,
    total,
  };
}

export function updateBikePrice(bike: Bike, newPrice: Money): Bike {
  if (bike.isSold) {
    throw new Error(`cannot change the price of a sold bike`);
  }

  if (bike.price.currency !== newPrice.currency) {
    throw new Error(`cannot change bike price to a different currency`);
  }

  const updatedBike = Object.freeze({
    ...bike,
    price: newPrice,
  });

  notify(updatedBike, {
    type: "BikePriceUpdated",
    bikeId: updatedBike.id,
    price: updatedBike.price,
  } satisfies BikeEvent);

  return updatedBike;
}

export function sellBike(bike: Bike): Bike {
  if (bike.isSold) {
    throw new Error(`bike is already sold`);
  }

  const soldBike = Object.freeze({
    ...bike,
    isSold: true,
  });

  notify(soldBike, {
    type: "BikeSold",
    bikeId: soldBike.id,
  } satisfies BikeEvent);

  return soldBike;
}
