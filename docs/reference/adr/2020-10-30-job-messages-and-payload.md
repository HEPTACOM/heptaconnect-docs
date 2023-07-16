# 2020-10-30 - Job messages and payloads

## Context

In case of a structural change in a dataset you might need to migrate serialized data in a way to make in work with the latest code.
The data that is affected of the structural change can still be within a message queue provider and is often out of access until message handling.
You could unintentionally send duplicated messages to drain performance and increase I/O operations overall.


## Decision

* Extract job actions from the messages into the storage.
* Separate job payloads from their actions.
* Prevent sending of duplicate messages.
* Normalize the structure of a job regarding the current message structure.


## Consequences

This change adds a little overhead on the message dispatching but adds multiple benefits regarding upcoming structure changes and future I/O operations that can be prevented.


### Pros

* Prevention of duplicate messages reduces handler calls and follow-up I/O operations.
* Message payloads can be accessed without knowledge about the used message provider.
* When emptying a message queue the messages can be reconstructed in a plausible order.
* The message provider has less data to store than before.
* It is easy to add new job types in the core without changing the storage.


### Cons

* More I/O operations have to be done when the message handlers have to hydrate the message with the payload storage before processing can be continued.
* It is difficult to add new job types that are not similar to the existing jobs when there is a structural mismatch.


## Related thoughts

Datasets could use some sort of migration pattern which can be applied by the storage implementations onto their stored payload to react to a structural change.
When a new job has to be introduced that is not related to this job pattern which is tied to mapping components a new message type can be introduced instead.
