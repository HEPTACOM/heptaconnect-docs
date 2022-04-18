# 2020-01-27 - Telemetry recording

## Context

API web requests, file system access, database requests, message queue dispatches, I/O interrupts, interprocess communication and similar interactions are part of any portal.
The usage of these resources should be known to a certain degree for monitoring of usage compared against a usage limitation, order of calls across portal nodes and their time of action.


## Decision

The information have to be connected to a portal node and its structural resource subdivision.
There is no context given as it is just about when and what kind of categories are affected.
For example a processing involving the transport of a file does not contain the complete file but can be tagged with e.g. the mime type or encoding, ….
There need to be common decorators for common implementations to simplify automatic recording like PSR HTTP client.
Adding common decorators in a global registry simplifies the usage of portal node developer that can depend on common decorator implementations.
The telemetry entry only represents a single direction in a synchronous interaction and should represent two directions as two entries in an asynchronous interaction.
Incoming web requests and cronjob runs are automatically recorded.
Telemetry has to be optional by core configuration as the storage is impacted heavily and it can affect the performance.
Storing telemetry data is not allowed to break the portal node flow by e.g. throwing an exception.
Recording describes an incrementable reference object that stores the timestamps of each increment and is taggable.

The exact way for analysis of the recorded data is up to discussion and postponed to a different point in time.


## Consequences

### Pros

* Analysis of API usages helps to identify upcoming limitation breaks.
* By requests across portal nodes it helps to identify errors in flow and order.
* Taggable incrementable reference objects allow for data point analysis of groups and of fine grain later on.


### Cons

* Although supporting infrastructure is given it adds a heavy complexity layer to portal node developers that needs to be simplified.
* Depending on the implementation the storage is heavily impacted by amount of data and frequent usage. This can end up in a project-wide bottleneck.


### How to use

A suggested pattern is that portal class prepares API clients.
They should be easily wrapped by a decorator whereas the instantiation should be lightweight.
Any context is able to supply a telemetry accessor that can be passed to other services and decorators for easy usage.


## Related thoughts

The space reduction of the storage and performance impact can be accomplished by a recording instance that receives the prepared payloads via a message broker.
Telemetry recording can be stored in-memory and flushed later for performance reasons.
Telemetry should not be abused for success/failure metrics as this is part of internal analysis on mapping errors.
