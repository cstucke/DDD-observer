# Bicycle Ordering Domain

This project uses a **bicycle ordering system** as the example domain.

The goal is to model customer orders for bicycles in a way that starts simple and intentionally unsafe, then gradually becomes more reliable through stronger types and domain rules.

## Core Concepts

The current domain revolves around a single concept: an **Order**.

An order represents a customer buying one bicycle model with some basic purchase details:

- customer name
- customer email
- bicycle model
- unit price
- quantity
- whether express assembly was requested
- total price

Each order also has an `id` so the system can distinguish one order from another.

## Business Meaning

In real terms, the order is meant to answer simple questions such as:

- Who is buying the bicycle?
- Which bicycle are they buying?
- How many are they buying?
- How much should they pay?
- Did they request express assembly?

This is enough to demonstrate how bad data can pass through a system when everything is represented with raw `string`, `number`, and `boolean` values.

## Business Rules We Care About

These are the important rules for this domain, even if Phase 2 does not enforce them yet:

- a bicycle price should never be negative
- a quantity should be greater than zero
- a customer email should be a real email-shaped value
- a customer name and customer email should not be interchangeable
- the total should match the order details instead of being trusted blindly
- an order id should uniquely identify one order over time

## Why This Domain Fits The Exercise

The bicycle ordering domain is small, but it still exposes the exact problems this exercise is meant to teach:

- primitive obsession
- silent bugs
- weak validation at the boundaries
- missing domain invariants

For example, if `price` is just a `number`, the code can accept `-1200`.
If `customerName` and `customerEmail` are both just `string`, they can be swapped accidentally and TypeScript will not complain.

## Expected Evolution Across Phases

In Phase 2, the order is deliberately a dumb object made from primitives only.

In later phases, this same bicycle ordering domain should evolve like this:

- branded types separate concepts like `Price`, `Email`, and `OrderId`
- smart constructors reject invalid values at creation time
- value objects group related concepts and behavior
- entities keep stable identity while state changes
- observers react to order events without tight coupling

This means the business logic written in code should increasingly reflect the real rules of bicycle ordering, instead of relying on developer discipline alone.
