# Nomenclature

There are several types of classes or entities referenced throughout this documentation. To have a uniform understanding of their meanings they are listed here with a short definition and explanation.

## Portal

A `Portal` is the implementation of an endpoint to connect it via HEPTAConnect. When you want to provide connectivity for an external API or some other form of data storage, you implement a portal. So a portal is not exactly one type of classes but rather a name for the bundle of code that is necessary for HEPTAConnect to communicate with an endpoint.

### PortalNode

A `Portal` is not the connection to an endpoint but the implementation of an endpoint. A `Portal` can then be configured with customizable fields. These fields may hold information like API-URLs, user credentials, file locations and so on. A configured `Portal` that is ready to communicate to an endpoint or data storage is called a `PortalNode`. A single `Portal` can potentially be used for many `PortalNodes`.

### Emitter

An `Emitter` reads data from the endpoint or data storage of a `PortalNode`, prepares the data in a structured form and the emits these structs. An `Emitter` can also choose, which data types it supports. When it is asked to read data, a collection of `Mappings` and a `PortalNode` identifier are passed to its `emit` method. The `Emitter` will then read the data identified by the `Mappings` using the connection configuration of the passed `PortalNode` and create a collection of `DatasetEntities` that hold the data in a structured form. Finally the collection of `DatasetEntities` and the `PortalNode` identifier need to be passed to the `Courier` .

### Receiver

A `Receiver` unfolds `DatasetEntities` and writes the data to the endpoint or data storage of a `PortalNode`. A `Receiver` can also choose, which data types it supports. When it is asked to write data, a `PortalNode` identifier and a collection of structs containing both a `DatasetEntity` and a `Mapping` are passed to its `receive` method. These structs associate a `DatasetEntity` with a `Mapping` to make bulk processing easier. The `Receiver` will then write the data of each `DatasetEntity` using the connection configuration of the passed `PortalNode` and update the respective `Mappings` with external identifiers accordingly. Finally the updated `Mappings` need to be passed to the `MappingService`, so the external identifers can be persisted.

### Courier

The `Courier` is a central service used by an `Emitter` to pass its produced data to. The `Courier` wraps the `DatasetEntity` in an `Envelope` and adds a `SourcePortalNodeStamp` to it. After that the envelope is passed to the `MessageBus`.

### Morpher

A `Morpher` is a special form of `PortalNodes`. `Morphers` can receive various data types and store the entities temporarily. When certain conditions are met, the `Morpher` triggers its own `Emitter` to emit processed data. This could be used to collect different aspects of an entity and resolve dependencies. A `Morpher` could e. g. collect orders, addresses and customers and keep the data to itself until every sub-entity of the order has been received (a. k. a. all dependencies are resolved). After that the `Morpher` will emit a compound `DatasetEntity` with all the necessary data.

## Dataset

A `Dataset` is a collection of common data structs that various `Portals` can rely on. There are different `Datasets` for different use cases and even some compound `Datasets` that consist of multiple smaller `Datasets`. A `Dataset` is typically distributed as its own composer repository and can be required by a `Portal`.

### DatasetEntity

A single entity in a `Dataset` is called a `DatasetEntity`. They are used to have a common data structure to pass objects from one `Portal` to another. Effectively a `Portal` does not need to know other `Portals` but simply work with `DatasetEntities` that other `Portals` also work with. This way any two `Portals` that share support for common `Datasets` can be connected.

### Envelope

An `Envelope` is used to add meta information to a message. A `DatasetEntity` has to be wrapped inside an `Envelope` before it is dispatched using the `MessageBus`. A typical `Envelope` needs a `DatasetEntity` as its message and a `SourcePortalNodeStamp` on it to determine the `PortalNode` that originally emitted it.

## Mapping

A `Mapping` is used to identify an entity in a `PortalNode`. It has an external identifier that points to the foreign entity, a `PortalNode` identifier that points to the `PortalNode` and a `MappingNode`. A mapping can also exist without an external identifier when the goal is to describe the connection between a `DatasetEntity` and a `PortalNode` before the foreign entity exists in the `PortalNode`. In practise this is used with `Receivers` when the foreign entity is yet to be created. HEPTAConnect will prepare a `Mapping` with the `PortalNode` identifier and a `MappingNode` but it will leave the external identifier empty. After the `Reciever` has created the foreign entity and has stored its identifier as external identifier in the `Mapping`, the MappingService will persist the `Mapping` with its external identifier.

### MappingNode

A `MappingNode` is used to associate various `Mappings` for different `PortalNodes` with each other. While one `Mapping` only points to a single foreign entity in a `PortalNode`, this is not enough to connect entities of different `PortalNodes` with each other. Every `Mapping` must have exactly one `MappingNode`, while one `MappingNode` can have multiple `Mappings`. If you wanted to connect two foreign entities of different `PortalNodes`, you would create a `Mapping` for both of them respectively and one `MappingNode` that is connected to both the created `Mappings`. A `MappingNode` also has a field to specify the data type of the mapped `DatasetEntity`.

### MappingService

The `MappingService` can be used to easily perform operations on `Mappings`. It can find existing `Mappings` for foreign entities, prepare empty mappings for a `DatasetEntity` and a `PortalNode` or persist `Mappings` after they received an external identifier.

## Router

The `Router` is a central point in the data flow between different `PortalNodes`. When an `Emitter` emits a collection of `DatasetEntities`, the `Router` will search for matching `Routes` with the corresponding `PortalNode` as source. It will then pass the collection of `DatasetEntities` to every `PortalNode` that is specified as target in these `Routes`.

### Route

A `Route` defines a direction for data to flow from one `PortalNode` to another. After setting up various `PortalNodes` it is necessary to create some `Routes`. When an `Emitter` emits data, the Router will pass this data to the `Receivers` of the `PortalNodes` that are found in the matching `Routes`. A Route has a source and a target field. Both of these fields hold identifiers of `PortalNodes`.
