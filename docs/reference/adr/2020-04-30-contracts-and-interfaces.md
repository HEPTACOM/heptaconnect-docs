# 2020-04-30 - Contracts and interfaces

## Context

There has to be a guide how to structure code to allow extendability.
We have to ensure that functionality can be exchanged without interfering with adjacent packages within the package hierarchy.

## Decision

The approved approach is using the language feature type hierarchy.
Using interfaces, traits and contracts (abstract classes) is a good way to structure and allow replacements by ensuring certain behaviors.

We use interfaces when multiple implementation will exist and are unknown at any time for the package that it is introduced in.
For example, we do not know what kind of storage is used within the portal-base, but it will need some kind of storage.

To supply some basic logic for commonly used interfaces we can provide traits for others to implement them easier.

We use contracts similar to interfaces but use their advantages to contain any logic beforehand.
This enables us to add additional code later with a reduced level of changes that can be non-breaking without removing the replacing option.
Contracts are best without dependencies that have to be given in the constructor as this forces other implementations to follow this pattern regardless whether they need it.

## Consequences

### Pros

* Others can build their own logic and replace existing one more easily

### Cons

* This adds more complexity in designing functionality as decisions have to be made whether interfaces or contracts are best suited
