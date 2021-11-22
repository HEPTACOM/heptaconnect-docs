# 2021-09-25 - Optimized storage actions

## Context

In the past we were approaching an entity repository pattern for reading and writing HEPTAconnect internal data.
This has been useful for building applications inside various frameworks in the past as their storages often come with a database abstraction layer that follows the same pattern.
In any implementation that follows the entity repository pattern we have the issue that reading the data for different use cases is different and therefore performance varies significantly.
When we started to extract reading access for mappings in different parts we had much more control in the underlying storage layer.


## Decision

We split up the different reading scenarios into separate classes.
Writing operations potentially need to read other data first so these need to be extracted as well.
All write operations should be transactional to ensure a known state in case of an exception.
With their transactional behaviour their return value can safely be a fixed collection of values.
Other operations that run indefinitely long as they look for and load data should return an iterable of a single entry.
As every operation will have its own class and the intention is not to add future methods into the services, we will use [interfaces](./2020-04-30-contracts-and-interfaces.md).
Names of the operations are not prescribed and should represent the expected business logic.
Ingoing payload- and criteria- as well as returned result objects should have verbose property names to prevent ambiguity errors in the future. 
With this in mind we found these naming patterns to be useful:

* list - is a non-human-used listing of a search based upon a criteria
* overview - is a human-used listing of a pageable search with various information
* create - creates a batch of entries which should return the primary keys
* get - read a list of entries based upon primary keys
* find - look for a certain entry by its unique components


## Consequences

### Pros

* Every storage access can be optimized separately
* Storage accessing tests can be mocked more easily

### Cons

* We need a services for every storage operation
* New access variations need a new release of the storage-base and all storage implementations
