# 2021-10-29 - Flow components are not CRUD

## Context

At the time of writing we have explorers, emitters and receivers as three main flow components.
They resemble CR and U from the well-known [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete).
Most APIs are CRUD or [BREAD](http://paul-m-jones.com/post/2008/08/20/bread-not-crud/) based and therefore match the three named flow components. 
For now, emitting and receiving entities can be also used differently as this "just" sends data from one portal node and is received by another portal node.
Emitters and receivers could send commands instead of entities.
As previously mentioned we do not have a deletion flow component.
A receiver could receive an entity with a custom deletion command with any previous version of HEPTAconnect. 
This is discouraged but possible.
We have already seen implementations, that receive data but don't write anything to the API the portal resembles.
This is a misuse that is similar to described scenario above.
Looking at the other existing flow components we also have webhooks and status reporters.
These are not related to CRUD at all, so we are not limited to CRUD.


## Decision

Receivers are not meant to do everything, when it is about receiving a command.
Receivers are meant to be used for entities only.
Grouping explorers, emitters, receivers and "deleters" into a single CRUD flow component enforces structures that probably don't benefit APIs, that do not fall into this pattern.
Grouping flow components is not helpful when we do not know the possible groups in beforehand and therefore can't be done right.
Every other transfer needs a new flow component.
As routes connect emitters and receivers they need to learn how to decide which flow components to use on a route.
This is described in a [different ADR](./2021-10-30-route-capabilities.md).


## Consequences

### Pros

* New data flows can be implemented by custom integrations without misusing existing components, which could lead to unexpected behaviour
* Separating different flows into unique components allows for clear code structures


### Cons

* New data flows need new flow components to be developed, integrated in routes and implemented
* Routes need to be configured per each flow scenario
