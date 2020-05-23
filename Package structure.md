# Package structure

This software is divided into several repositories that have composer dependecies on each other. Some of the packages are always required for a functional HEPTAConnect ecosystem while others are more or less optional or specific to the use case. This article attempts to clarify the structure of the different packages and outline their role in the ecosystem.

### heptaconnect-core

HEPTAConnect is designed to be able to adopt to its surrounding software. Therefore the core itself will not run without a surrounding runtime. To make this work, there are bridges to connect the core with a runtime. The runtime will then (through the bridge) provide a storage, a messenger and several other components that the core will then make use of. Because of this approach, the core is very portable and can run in a number of runtimes (if they can provide all requirements).

### heptaconnect-portal-base

Since HEPTAConnect itself is not much more than a framework, it does not come with any external connectivity. To connect an external API, you will need to provide a portal for this API. A portal has to require the portal base and whatever datasets it may supports. The portal base comes with structs and interfaces that a portal will need in order to work.