# Mapping

Since HEPTAconnect enables various systems to exchange data and keep it synchronized, it will need to keep track of the data it transfers from one system to another.
This is done via mappings.
This article will go into detail about how mappings are structured and how they work in HEPTAconnect.

### MappingNode

Every entity in a PortalNode (that should be visible to HEPTAconnect) must receive a mapping.
So a mapping represents a single entity inside of a PortalNode.
Every mapping also has a MappingNode.
These are used to connect different mappings from different PortalNodes with each other.
Several mappings can share a MappingNode to indicate that they mark the same entity throughout different PortalNodes.
A MappingNode itself knows its data type and its origin (the PortalNode of the first mapping associated with this MappingNode).
The associated mappings know the external identifier and have an association to their PortalNode.

Example: A product in an ERP system is published to HEPTAconnect.
This means, it now has a mapping which in turn has a MappingNode.
HEPTAconnect then transfers this product to an ecommerce system.
Upon creation the ecommerce system responds with an identifier for the newly created product.
HEPTAconnect will now save a new mapping for the product in the ecommerce system with the same MappingNode.
So there are now two mappings for the same product in two different PortalNodes that share a MappingNode.

### Publisher

To make HEPTAconnect aware of an entity inside a PortalNode, that entity has to be published.
The publisher will create a mapping and a MappingNode for an entity and it will schedule the entity to be emitted.
Because the actual emitting will happen asynchronously, the publisher can be called during a web request with a minimal performance impact.
For the initial integration into an existing HEPTAconnect ecosystem, it is recommended for a PortalNode to publish every entity that should be synchronized by HEPTAconnect.
This process is called exploration.

### Exploration

A recommended step in adding a new PortalNode into a HEPTAconnect ecosystem is the exploration.
A portal can ship multiple explorers that will each publish every entity of a certain type from its PortalNode.
While this process could in theory be done manually, it is recommended to create classes implementing the ExplorerContract.
The benefit is a better integration into automated processes of HEPTAconnect, so your exploration process can be triggered by the system rather than relying on a manual trigger.

### Identities

To perform operations on mappings, various storage actions can be used depending on the exact use case:

* `\Heptacom\HeptaConnect\Storage\Base\Contract\Action\Identity\IdentityMapActionInterface` used to create missing mappings for entities
* `\Heptacom\HeptaConnect\Storage\Base\Contract\Action\Identity\IdentityPersistActionInterface` used to update mappings on existing mapping nodes

These service can save mappings to the storage and find a counterpart of a mapping for another PortalNode.
This is done after an identifier has been set on an entity by a receiver.

The process of finding a counterpart of a mapping for another PortalNode is called reflecting.
The `\Heptacom\HeptaConnect\Storage\Base\Contract\Action\Identity\IdentityReflectActionInterface` will check, if the provided entities have known mappings in the management storage.
Afterwards the service checks, if a reference mapping for the requested PortalNode already exists and assigns it.

### Error handling

There are situations that are prone to error regarding mappings, like e.g. when a mapping is passed to a receiver but the receiver throws an exception.
These errors are stored in the database alongside the mapping.
The idea is to associate errors to the entities they are related to.
