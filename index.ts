import { v4 as uuidv4 } from "uuid";

/*
 ** avoid any "weird" number as input
 */

/* 1. Type definitions */

type Price = number & { readonly __brand: unique symbol };
type CustomerEmail = string & { readonly __brand: unique symbol };
type BikeModel = string & { readonly __brand: unique symbol };
type Currency = string & { readonly __brand: unique symbol };
type BikeId = string & { readonly __brand: unique symbol };

type Money = Readonly<{
  amount: Price;
  currency: Currency;
}>;

type Observer<T> = (event: T) => void;

type Order = {
  id: string;
  customerName: string;
  customerEmail: CustomerEmail;
  bicycleModel: BikeModel;
  price: Price;
  quantity: number;
  expressAssembly: boolean;
  total: Price;
};

/* 2. Factory functions */

function createPrice(price: number): Price {
  if (price < 0) {
    throw new Error(`invalid price!`);
  }
  return price as Price;
}

function createEmail(email: string): CustomerEmail {
  if (!email.includes(`@`)) {
    throw new Error(`invalid email!`);
  }
  return email as CustomerEmail;
}

function createBikeModel(bike: string): BikeModel {
  if (bike.length === 0) {
    throw new Error(`invalid Bike name`);
  }
  return bike as BikeModel;
}

function createCurrency(currency: string): Currency {
  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new Error(`invalid currency code`);
  }
  return currency as Currency;
}

function createMoney(amount: number, currency: string): Money {
  return Object.freeze({
    amount: createPrice(amount),
    currency: createCurrency(currency),
  });
}

function addMoney(moneyA: Money, moneyB: Money): Money {
  if (moneyA.currency !== moneyB.currency) {
    throw new Error(`cannot add money with different currencies`);
  }
  return createMoney(moneyA.amount + moneyB.amount, moneyA.currency);
}

function updateMoneyAmount(money: Money, newAmount: number): Money {
  return createMoney(newAmount, money.currency);
}

function createBikeId(): BikeId {
  return uuidv4() as BikeId;
}

function createBike(model: BikeModel, price: Money): Bike {
  return Object.freeze({
    id: createBikeId(),
    model,
    price,
    isSold: false,
    observers: Object.freeze([]),
  });
}

function createOrder(
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

/* 3. Entity definitions */

type Bike = Readonly<{
  id: BikeId;
  model: BikeModel;
  price: Money;
  isSold: boolean;
  observers: readonly Observer<BikeEvent>[];
}>;

function subscribe(
  bike: Bike,
  observer: Observer<BikeEvent>,
): Bike {
  return Object.freeze({
    ...bike,
    observers: Object.freeze([...bike.observers, observer]),
  });
}

function unsubscribe(
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

function notify(bike: Bike, event: BikeEvent): void {
  bike.observers.forEach((observer) => {
    observer(event);
  });
}

function updateBikePrice(bike: Bike, newPrice: Money): Bike {
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
  });

  return updatedBike;
}

function sellBike(bike: Bike): Bike {
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
  });

  return soldBike;
}

function printBikeSummary(bike: Bike): void {
  console.log(
    `Bike ${bike.id}: ${bike.model} costs ${bike.price.amount} ${bike.price.currency} and sold=${bike.isSold}`,
  );
}

function printOrderSummary(order: Order): void {
  console.log(
    `${order.customerName} ordered ${order.quantity} x ${order.bicycleModel} for $${order.total}`,
  );
}

/* 4. Event types */

type BikePriceUpdated = Readonly<{
  type: "BikePriceUpdated";
  bikeId: BikeId;
  price: Money;
}>;

type BikeSold = Readonly<{
  type: "BikeSold";
  bikeId: BikeId;
}>;

type BikeEvent = BikePriceUpdated | BikeSold;

/* 5. Observer setup & test code */

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
const auditObserver: Observer<BikeEvent> = (event) => {
  console.log(`[audit] received ${event.type} for bike ${event.bikeId}`);
};

const emailObserver: Observer<BikeEvent> = (event) => {
  console.log(`[email] send notification for ${event.type}`);
};

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
