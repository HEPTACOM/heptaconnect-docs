# 2020-12-10 - Portal service container

## Context

Portal extensions shall be able to interfere with any operation the supported portal is doing to make any business logic within the supported portal adjustable.
This is already possible having the explorer, emitter and receiver stacks when it is about changing the flow and the incoming data from HEPTAconnect and the outgoing data towards HEPTAconnect.
There is no way yet to change the exact behaviour how an API is used within the supported portal.
It has been suggested to expose the operational APIs as public methods in the supported portal class.
Portal extension are able to interact with the same APIs like their supported portal but not yet able to change the implementation of these public methods.


## Decision

* Use PSR-11 containers
* Do not use inheritance / decoration between portal extensions and the portal itself
* Do not use a container builder as there is no common interface yet and is not needed yet
* Do not use a hook pattern

## Consequences

### Pros

* Portal developers can decide what is allowed to be changed
* Portal and portal extension developers can use the commonly known container way of publishing services within an application


### Cons

* Portal developers have to publish every implementation to allow being changed
* Containers have to be managed per stack to prevent
* To have static typing you have to add additional `instanceof` checks or trust type hints


## Related thoughts

One could use inheritance and decoration pattern to allow portal extension claim to be the supported portal but this moves all the development overhead to the developer

There is a follow up to this regarding the exact [implementation](./2021-04-13-portal-dependency-injection-implementation.md).
