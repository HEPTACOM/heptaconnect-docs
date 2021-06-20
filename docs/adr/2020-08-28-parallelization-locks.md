# 2020-08-28 - Parallelization locks

## Context

In horizontally scaled processes problems of parallelization can happen like race conditions (a resource is accessed simultaneously by multiple processes and can have a different value for each process as a previous one wrote to the resource before).

## Decision

To support horizontal scaling there is also the need to allow resource locking.
As the resource accessing is part of transmitting data over time or space, the storages and portals should be able to use this feature.
Therefore we will put in the contracts into the portal-base.
As locks need some sort of storage to maintain a lock state an additional repository has to be added to the storages.

The featured methods shall be:

* isLocked
* lock
* release

A utility class or methods to easily write spinlocks by time or iteration shall be added.

Locks shall rather run out of time or a different measurement instead to unintentionally lock a resource.

## Consequences

### Pros

* Horizontal scaling is easier to support for portals and storages
* It is easier to implement checks to prevent resource requests that should not be overlapping

### Cons

* Portals and storages who uses this feature will perform worse than without using this feature
