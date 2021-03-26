# Data flow

In HEPTAconnect we separate different steps where data processing is happening to have different entry points for developers and enable horizontal scaling for each step.
The main steps are exploration, emission and reception.
The exploration can be triggered from different places and will follow in emissions and receptions when the data routes exists. 
In the following paragraphs you will see what kind of data flows can occur:

## Basic flow

The basic flow of the previous mentioned steps exploration, emission and reception in their most common form.
For this you need to implement a handler for each step: An [explorer](../portal-development/002-explorer.md), an [emitter](../portal-development/003-emitter.md) and a [receiver](../portal-development/004-receiver.md).

<!--
```plantuml
@startuml ../assets/plantuml/dataFlow/basicFlow
!include ../../src/skin.puml
database "Portal 1" as P1
database "Portal 2" as P2
entity HEPTAconnect as HC
control MessageBroker as MB

== Exploration ==
P1 ->> HC: Read ids from portal 1
HC ->> MB: Publish explored item ids
...
== Emission ==
HC <<- MB: Read for emission
P1 ->> HC: Read data from portal 1
HC ->> MB: Release emitted item
...
== Reception ==
HC <<- MB: Route data for reception
P2 <<- HC: Store data in portal 2
@enduml
```
-->
![](../assets/plantuml/dataFlow/basicFlow.svg)

## Direct emission flow

This is a condensed form of the basic flow as the first two steps are merged into one.
A very useful pattern for sources that do not differ between gathering selecting primary keys and their corresponding data on it.
For this flow you only need to implement [explorers](../portal-development/002-explorer.md) as [direct emission explorers](../portal-development/014-direct-emission-explorer.md) and [receivers](../portal-development/004-receiver.md).
To ensure other flows like the next one you still have to provide an [emitter](../portal-development/003-emitter.md) which can be omitted otherwise.

<!--
```plantuml
@startuml ../assets/plantuml/dataFlow/directEmissionFlow
!include ../../src/skin.puml
database "Portal 1" as P1
database "Portal 2" as P2
entity HEPTAconnect as HC
control MessageBroker as MB
== Direct Emission ==
P1 ->> HC: Read data from portal 1
HC ->> MB: Release explored item for emission
...
== Reception ==
HC <<- MB: Route data for reception
P2 <<- HC: Store data in portal 2
@enduml
```
-->
![](../assets/plantuml/dataFlow/directEmissionFlow.svg)

## Reverse publication flow

The reverse publication is requesting data from a previously running transfer a second time to keep data up-to-date.
This is useful for any event driven data transfer that has to happen on demand.

<!--
```plantuml
@startuml ../assets/plantuml/dataFlow/reversePublicationFlow
!include ../../src/skin.puml
database "Portal 1" as P1
database "Portal 2" as P2
entity HEPTAconnect as HC
control MessageBroker as MB

== Reverse Publication ==
P2 ->> HC: Request publication for portal 2
HC ->> MB: Request emission from portal 1
...
== Emission ==
HC <<- MB: Read for emission
P1 ->> HC: Read data from portal 1
HC ->> MB: Release emitted item
...
== Reception ==
HC <<- MB: Route data for reception
P2 <<- HC: Store data in portal 2
@enduml
```
-->
![](../assets/plantuml/dataFlow/reversePublicationFlow.svg)
