# Package structure

This software is divided into several repositories that have composer dependecies on each other. Some of the packages are always required for a functional HEPTAconnect ecosystem while others are more or less optional or specific to the use case. This article attempts to clarify the structure of the different packages and outline their role in the ecosystem.

### Bridge

HEPTAconnect is designed to be able to adopt to its surrounding software. Therefore the core itself will not run without a surrounding runtime. To make this work, there are bridges to connect the core with a runtime. The runtime will then (through the bridge) provide a storage, a messenger and several other components that the core will then make use of. Because of this approach, the core is very portable and can run in a number of runtimes (if they can provide all requirements).

<!--
```plantuml
@startuml assets/packageStructure/BridgeShopwarePlatform
!include ../../src/skin.puml
rectangle "Bridge-ShopwarePlatform" as BSP #007aff
@enduml
```
-->
![](assets/packageStructure/BridgeShopwarePlatform.svg)

### Core

At its core HEPTAconnect manages data streams between different endpoints via asynchronously handled messages. One side goes through its entities for a dataset and emits whatever it can find. The other side receives these entities and saves them to an other endpoint. It is the core's job to coordinate this traffic and keep things organized. So the core provides a router, a mapping service, an emit service, a receive service, a webhook service and other tooling.

<!--
```plantuml
@startuml assets/packageStructure/Core
!include ../../src/skin.puml
rectangle "Bridge-ShopwarePlatform" as BSP
rectangle "Core" as C #007aff
BSP --|> C
@enduml
```
-->
![](assets/packageStructure/Core.svg)

### Storage-Base

Certain components of HEPTAconnect require a form of persistent storage. An example is the mapping of entities. To remember which records of different portal nodes are actually the same entity, a mapping is created and stored in a storage. Since the bridge is the only package that actually knows the surrounding runtime, only it can implement a storage adapter. The storage base will only provide interfaces for the storage, so the core can interact with the storage but does not need to know the actual implementation.

<!--
```plantuml
@startuml assets/packageStructure/StorageBase
!include ../../src/skin.puml
rectangle "Bridge-ShopwarePlatform" as BSP
rectangle "Core" as C
rectangle "Storage-Base" as SB #007aff
C --|> SB
BSP --|> C
BSP --|> SB
@enduml
```
-->
![](assets/packageStructure/StorageBase.svg)

### Portal-Base

Since HEPTAconnect itself is not much more than a framework, it does not come with any external connectivity. To connect an external API, you will need to provide a portal for this API. A portal has to require the portal base and whatever datasets it may support. The portal base comes with structs and interfaces that a portal will need in order to work.

<!--
```plantuml
@startuml assets/packageStructure/PortalBase
!include ../../src/skin.puml
rectangle "Bridge-ShopwarePlatform" as BSP
rectangle "Core" as C
rectangle "Portal-Base" as PB #007aff
rectangle "Storage-Base" as SB
C --|> SB
C --|> PB
SB --|> PB
BSP ---|> C
BSP ---|> SB
@enduml
```
-->
![](assets/packageStructure/PortalBase.svg)

### Dataset-Base

HEPTAconnect is all about data. Reading data, moving it from one point to an other and writing it again. To make different portals understand each other, they use common datasets. A dataset is a group of class definitions for a type of data. Usually these data types are grouped into sets by their topic. The dataset base consists of interfaces and helper classes to make up a base for the individual datasets.

<!--
```plantuml
@startuml assets/packageStructure/DatasetBase
!include ../../src/skin.puml
rectangle "Bridge-ShopwarePlatform" as BSP
rectangle "Core" as C
rectangle "Dataset-Base" as DB #007aff
rectangle "Portal-Base" as PB
rectangle "Storage-Base" as SB
C --|> SB
C --|> PB
C --|> DB
SB --|> DB
SB --|> PB
PB --|> DB
BSP ---|> C
BSP ---|> SB
@enduml
```
-->
![](assets/packageStructure/DatasetBase.svg)

### Dataset

A single dataset can hold a number of classes for different data types. Datasets can also require other datasets to make up larger sets. The dataset for physical locations has no requirements as it is very much limited to its own case that cannot be further broken apart. The dataset for ecommerce is rather complex and has requirements for many other datasets to cover parts of its needs.

<!--
```plantuml
@startuml assets/packageStructure/Datasets
!include ../../src/skin.puml
rectangle "Bridge-ShopwarePlatform" as BSP
rectangle "Core" as C
rectangle "Dataset-Base" as DB
rectangle "Dataset-Ecommerce" as DE #007aff
rectangle "Dataset-PhysicalLocation" as DPL #007aff
rectangle "Dataset-Product" as DP #007aff
rectangle "Dataset-Social" as DS #007aff
rectangle "Portal-Base" as PB
rectangle "Storage-Base" as SB
C --|> SB
C --|> PB
C --|> DB
DE --|> DB
DPL --|> DB
DP --|> DB
DS --|> DB
DS --|> DPL
DP --|> DPL
DE --|> DPL
DE --|> DP
DE --|> DS
SB --|> DB
SB --|> PB
PB --|> DB
BSP ---|> C
BSP ---|> SB
@enduml
```
-->
![](assets/packageStructure/Datasets.svg)

### Portal

Because HEPTAconnect should bring data of different systems together, it has to be someone's responsibility to actually connect to different systems. This is where portals come into play. A portal is a package with emitters and receivers that can read data from and write data to an endpoint. In most cases this endpoint is an API of some sort, but it does not have to be one. In theory this can also be an access to a static local file or a local database. The important part is that a portal connects an external system with the HEPTAconnect ecosystem. The portal has to require all its supported datasets. Portals with shared supported datasets are natively compatible with each other, as their data can be easily transferred from one portal to the other.

<!--
```plantuml
@startuml assets/packageStructure/Portals
!include ../../src/skin.puml
rectangle "Bridge-ShopwarePlatform" as BSP
rectangle "Core" as C
rectangle "Dataset-Base" as DB
rectangle "Dataset-Ecommerce" as DE
rectangle "Dataset-PhysicalLocation" as DPL
rectangle "Dataset-Product" as DP
rectangle "Dataset-Social" as DS
rectangle "Portal-Base" as PB
rectangle "Portal-BusinessCentral" as PBC #007aff
rectangle "Portal-ShopwarePlatform" as PSP #007aff
rectangle "Storage-Base" as SB
C --|> SB
C --|> PB
C --|> DB
DE --|> DB
DPL --|> DB
DP --|> DB
DS --|> DB
DS --|> DPL
DP --|> DPL
DE --|> DPL
DE --|> DP
DE --|> DS
SB --|> DB
SB --|> PB
PB --|> DB
PBC --|> PB
PBC --|> DE
PSP --|> PB
PSP --|> DE
BSP ---|> C
BSP ---|> SB
@enduml
```
-->
![](assets/packageStructure/Portals.svg)

### Integration

The integration is the one package that holds it all together. It is a composition of all required packages necessary for the use case at hand. So this package really changes from project to project and is the most individual part of the software. Typically an integration is composed by specifying all portals that should be connected with each other and a runtime for the software to run. In this example we choose the Shopware bridge as the runtime and the portals for Shopware and Business Central as our portals. Because our runtime is Shopware, the integration has to be a Shopware plugin with the bridge and the portals registered as additional bundles.

<!--
```plantuml
@startuml assets/packageStructure/ShopwarePlatformBusinessCentralIntegration
!include ../../src/skin.puml
rectangle "Bridge-ShopwarePlatform" as BSP
rectangle "Core" as C
rectangle "Dataset-Base" as DB
rectangle "Dataset-Ecommerce" as DE
rectangle "Dataset-PhysicalLocation" as DPL
rectangle "Dataset-Product" as DP
rectangle "Dataset-Social" as DS
rectangle "Portal-Base" as PB
rectangle "Portal-BusinessCentral" as PBC
rectangle "Portal-ShopwarePlatform" as PSP
rectangle "Storage-Base" as SB
node "Shopware Plugin BC Integration" as SPBBC #007aff
C --|> SB
C --|> PB
C --|> DB
DE --|> DB
DPL --|> DB
DP --|> DB
DS --|> DB
DS --|> DPL
DP --|> DPL
DE --|> DPL
DE --|> DP
DE --|> DS
SB --|> DB
SB --|> PB
PB --|> DB
PBC --|> PB
PBC --|> DE
PSP --|> PB
PSP --|> DE
BSP ---|> C
BSP ---|> SB
SPBBC --0 BSP
SPBBC --0 PSP
SPBBC --0 PBC
@enduml
```
-->
![](assets/packageStructure/ShopwarePlatformBusinessCentralIntegration.svg)
