import { v4 as uuidv4 } from "uuid";

import { auditObserver } from "./infrastructure/observers/database.js";
import { emailObserver } from "./infrastructure/observers/email.js";
import { subscribe, unsubscribe, type Observer } from "./infrastructure/observers/observer.js";
import {
  addMoney,
  createBike,
  createBikeModel,
  createEmail,
  createMoney,
  createOrder,
  createPrice,
  sellBike,
  updateBikePrice,
  updateMoneyAmount,
} from "./domain/product/factories.js";
import { printBikeSummary, printOrderSummary, type Order } from "./domain/product/product.js";
import type { BikeEvent } from "./domain/events/events.js";

/*
 ** avoid any "weird" number as input
 */

// TypeScript should refuse these assignments in Phase 3.
// const invalidPrice: Price = 899;
// const invalidEmail: CustomerEmail = "avery@example.com";

// modify this code for testing !!
// this replicates user input
const orderOne: Order = {
  id: uuidv4(),
  customerName: "Avery Brooks",
  customerEmail: createEmail("avery@example.com"),
  bicycleModel: createBikeModel("City Cruiser"),
  price: createPrice(899),
  quantity: 1,
  expressAssembly: false,
  total: createPrice(899),
};

const orderTwo = createOrder(
  "Jordan Lee",
  createEmail("jordan@example.com"),
  createBikeModel("Trail Blazer"),
  createPrice(1450),
  2,
  true,
);

const orderThree = createOrder(
  "Sam Patel",
  createEmail("sam@example.com"),
  createBikeModel("Road Sprint"),
  createPrice(2100),
  1,
  false,
);

console.log("Phase 3: bicycle orders with branded types");
printOrderSummary(orderOne);
printOrderSummary(orderTwo);
printOrderSummary(orderThree);

console.log("");
console.log("Phase 5: value object (Money)");
const bicyclePrice = createMoney(899, "USD");
const assemblyFee = createMoney(75, "USD");
const totalMoney = addMoney(bicyclePrice, assemblyFee);
const discountedTotal = updateMoneyAmount(totalMoney, 849);
console.log(`Bike price: ${bicyclePrice.amount} ${bicyclePrice.currency}`);
console.log(`Assembly fee: ${assemblyFee.amount} ${assemblyFee.currency}`);
console.log(`Total: ${totalMoney.amount} ${totalMoney.currency}`);
console.log(
  `Discounted total: ${discountedTotal.amount} ${discountedTotal.currency}`,
);
console.log(
  `Original total unchanged (immutable): ${totalMoney.amount} ${totalMoney.currency}`,
);

console.log("");
console.log("Phase 6: entity (Bike)");
const bikeOne = createBike(createBikeModel("Commuter Pro"), createMoney(1299, "USD"));

const uiObserver: Observer<BikeEvent> = (event) => {
  console.log(`[ui] refresh bike card after ${event.type}`);
};

const observedBike = subscribe(
  subscribe(subscribe(bikeOne, auditObserver), emailObserver),
  uiObserver,
);
const repricedBike = updateBikePrice(observedBike, createMoney(1349, "USD"));
const bikeWithoutEmailObserver = unsubscribe(repricedBike, emailObserver);
const soldBike = sellBike(bikeWithoutEmailObserver);
printBikeSummary(bikeOne);
printBikeSummary(observedBike);
printBikeSummary(repricedBike);
printBikeSummary(soldBike);
console.log(`Same bike identity across state changes: ${bikeOne.id === soldBike.id}`);

try {
  updateBikePrice(soldBike, createMoney(1399, "USD"));
} catch (error) {
  console.log(`Sold bike price change rejected: ${(error as Error).message}`);
}

try {
  sellBike(soldBike);
} catch (error) {
  console.log(`Invalid bike transition rejected: ${(error as Error).message}`);
}

console.log("");
console.log("Phase 4 validation checks:");
try {
  createOrder(
    "Casey Quinn",
    createEmail("casey@example.com"),
    createBikeModel("Mountain Peak"),
    createPrice(-1200),
    1,
    true,
  );
} catch (error) {
  console.log(`Negative price rejected: ${(error as Error).message}`);
}

try {
  createOrder(
    "taylor@example.com",
    createEmail("Taylor Kim"),
    createBikeModel("Hybrid Flow"),
    createPrice(1100),
    1,
    false,
  );
} catch (error) {
  console.log(`Invalid email rejected: ${(error as Error).message}`);
}
