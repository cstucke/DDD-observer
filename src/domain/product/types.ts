export type Price = number & { readonly __brand: unique symbol };
export type CustomerEmail = string & { readonly __brand: unique symbol };
export type BikeModel = string & { readonly __brand: unique symbol };
export type Currency = string & { readonly __brand: unique symbol };
export type BikeId = string & { readonly __brand: unique symbol };

export type Money = Readonly<{
  amount: Price;
  currency: Currency;
}>;
