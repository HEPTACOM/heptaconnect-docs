# 2021-02-03 - Direct emission exploration

## Context

Data sources like plain tables (.csv, .tsv, .txt, .json, .xml) and slow/rate-limited APIs both share the fact that you want to keep the interaction count low.
Plain tables need to be parsed and are missing an index for fast navigation wich reduces speed in reading and often uses computation time and memory.
Rate-limited APIs should not be consumed twice for the same information.
When they allow retrieving list data similar to single entries that should be preferred to allow for smart rate-limit usage.


## Decision

* Allow emission to take place in the same moment as exploration


## Consequences

* There are now two places that can emit data and therefore the conversion logic from a data source payload to a HEPTAconnect dataset entity should be extracted

### Pros

* Portal developers can support multiple [data flows](../general-resources/data-flow.md)
* Named data source can be processed more efficient
* Portal developers do not have to cache data structures on exploration anymore for an efficient emission

### Cons

* Portal developers have to decide which of the [data flow models](../general-resources/data-flow.md) they want to support
* Additional complexity in the return type of [explorers](../../guides/portal-developer/explorer.md)' explore method as this can change the data flow to a [direct emission flow](../../guides/portal-developer/direct-emission-explorer.md) 
