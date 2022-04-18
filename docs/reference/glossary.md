# Glossary

<!-- Move parts to class reference  -->

There are several types of classes or entities referenced throughout this documentation.
To have a uniform understanding of their meanings they are listed here with a short definition and explanation.

## Flow components

### Explorer

An `Explorer` reads ids from the source and publishes them for emission.
This is suitable for initial object discovery in the data source and successive data transfer via emissions.

### Emitter

An `Emitter` reads data from the endpoint or data storage of a `PortalNode`, prepares the data in a structured form and then emits these structs.
When it is asked to read data, a collection of `Mappings` is passed to its `emit` method.
It is the `Emitters` job to connect to its data source and read the data (identified by the passed `Mappings`).
The data should then be structured as a collection of `MappedDatasetEntityStructs` and returned or yielded.

### Direct Emitter

An `Explorer` that does the work like an `Emitter` as it reads and yields complete objects instead of ids from the source and release them for emission.
This is suitable for faster object transfer or transfer that is triggered only by the source portal.

### Receiver

A `Receiver` receives a collection of `DatasetEntities` and writes the data to the endpoint or data storage of a `PortalNode`.
 When it is asked to write data, it traverses over the given collection, writes the data and retrieves an external identifier from the endpoint of the `PortalNode`.
This identifier is then set in the given mapping and the collection of mappings is returned or yielded.

## Portal

A `Portal` is the implementation of an endpoint to connect it via HEPTAconnect.
When you want to provide connectivity for an external API or some other form of data storage, you implement a portal.
So a portal is just a name for the composition of code (e.g. a composer package) that is necessary for HEPTAconnect to communicate with an endpoint.

### PortalNode

A `Portal` is not the connection to an endpoint but the implementation of an endpoint.
A `Portal` can then be configured with customizable fields.
These fields may hold information like API-URLs, user credentials, file locations and so on.
A configured `Portal` that is ready to communicate to an endpoint or data storage is called a `PortalNode`.
A single `Portal` can potentially be used for many `PortalNodes`.

### PortalRegistry

The `PortalRegistry` is provided by HEPTAconnect and can be used as a factory for `PortalNodes`.
When a component has an identifier of a `PortalNode` and needs the corresponding instance to interact with it, this service should be used to retrieve the instance.

### Bridge

The `Bridge` implements the core functionality in a certain environment by providing services for behaviours of the core that are dependent on the runtime of the surrounding application.
As HEPTAconnect is environment agnostic it is not specified by default which database server, ORM, message broker, request cycle manager, request routing or file storage is in use.

### Publisher

The `Publisher` is a central service that can be accessed by a `Bridge` to create `Mappings` for new entities.
Publishing means, you target one specific object inside one specific `PortalNode` and have HEPTAconnect create a `Mapping` for it.
The `Publisher` will prepare and schedule the freshly created `Mapping` for the `Emitter`.
This happens asynchronously, so a `Publisher` will not take up a lot of computing time and it can be called during a web request with minimal performance impact.

### Morpher

A `Morpher` is a special form of `PortalNode`.
`Morphers` can receive various data types and store the entities temporarily.
When certain conditions are met, the `Morpher` triggers its own `Emitter` to emit processed data.
This could be used to collect different aspects of an entity and resolve dependencies.
A `Morpher` could e.g. collect orders, addresses and customers and keep the data to itself until every sub-entity of the order has been received (a. k. a. all dependencies are resolved).
After that the `Morpher` will emit a compound `DatasetEntity` with all the necessary data.

### Packer

A `Packer` is a class that supports `Flow components` like `Direct Emitter` and `Emitter` packing API specific data into `DatasetEntities`.
This naming has been really helpful in the past to find the right entrypoint when extending other portals.
There is no interface or contract to follow.

### Unpacker

An `Unpacker` is a class that supports `Flow components` like `Receiver` unpacking `DatasetEntities` into portal API specific payloads.
This naming has been really helpful in the past to find the right entrypoint when extending other portals.
There is no interface or contract to follow.

## Dataset

A `Dataset` is a collection of common data structs that various `Portals` can rely on.
There are different `Datasets` for different use cases and even some compound `Datasets` (e.g. `ecommerce`) that consist of multiple smaller `Datasets` (e.g. `physical-location`).
`Datasets` are required by `Portals` to have a shared understanding of data and to establish communication between them.

### DatasetEntity

A single entity in a `Dataset` is called a `DatasetEntity`.
They are used to have a common data structure to pass objects from one `Portal` to another.
Effectively a `Portal` does not need to know other `Portals` but simply work with `DatasetEntities` that other `Portals` also work with.
This way any two `Portals` that share support for common `Datasets` can be connected.

## Mapping

A `Mapping` is used to identify an entity in a `PortalNode`.
It has an external identifier that points to the foreign entity, a `PortalNode` identifier that points to the `PortalNode` and a `MappingNode`.
A mapping can also exist without an external identifier when the goal is to describe the connection between a `DatasetEntity` and a `PortalNode` before the foreign entity exists in the `PortalNode`.
In practise this is used with `Receivers` when the foreign entity is yet to be created.
HEPTAconnect will prepare a `Mapping` with the `PortalNode` identifier and a `MappingNode` but it will leave the external identifier empty.
During a reception taking place in a `Receiver` the entities receive primary keys after they've been sent to the portal's  API.
After the `Receiver` finished its reception, any assigned primary key is passed to the management storage, which will store these external identifiers as mapping.

### MappingNode

A `MappingNode` is used to associate various `Mappings` for different `PortalNodes` with each other.
While one `Mapping` only points to a single foreign entity in a `PortalNode`, this is not enough to connect entities of different `PortalNodes` with each other.
Every `Mapping` must have exactly one `MappingNode`, while one `MappingNode` can have multiple `Mappings`.

## Router

The `Router` is a central point in the data flow between different `PortalNodes`.
When an `Emitter` emits a collection of `DatasetEntities`, the `Router` will search for matching `Routes` with the corresponding `PortalNode` as source.
It will then pass the collection of `DatasetEntities` to every `PortalNode` that is specified as target in these `Routes`.

### Route

A `Route` defines a direction for data to flow from one `PortalNode` to another.
After setting up various `PortalNodes` it is necessary to create some `Routes`.
A `Route` has a source, a target and a data type.

## Storage

HEPTAconnect requires a form of storage in order to be functional.
The storage is used to keep track of mappings, configurations and other data that is relevant to the system.
All access to a storage provider is abstracted in the storage base and the core only relies on these interfaces.

### Keys

The storage provider alone has data sovereignty over the keys that are used to persist entities in the data storage.
`Keys` can be obtained by a factory that is provided by the storage provider.
A `Key` is a small data structure that is a valid identifier in its origin storage (e.g. an auto-incremented integer or a UUIDv4).
The existence of a `Key` itself guarantees its validity.
