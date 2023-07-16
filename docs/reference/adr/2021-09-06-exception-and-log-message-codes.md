# 2021-09-06 - Exception and log message codes

## Context

Making log messages that are helpful is difficult for various reason.
You can not be sure which persona will read them (either administrator, integrator or portal developer).
Therefore, phrasing a good message takes additional thoughts.
Log messages in general just have a single line of text and some human-readable metadata that are crammed into the same line of text.
Sometimes crucial data is left out of a log message.
Most log messages are written when an exception is caught.
Exceptions can have integer codes assigned.
Exception codes are set on construction, which is in almost all cases the moment they are thrown.


## Decision

Exception stack traces are too big for log messages, so we need to refer to them in a different way.
When we pass a unique code to the exception constructor, we can identify the source code that triggers the exception immediately.
This makes exception codes a good alternative to stack traces.
There are also log message written without the situation to log an exception.
These message have no code from an exception but can benefit from a code to identify their origin as well.
Exception codes and log message codes need documentation with a class reference and a reason for occurrence to supply information for an administrator and a developer.


## Consequences

### Pros

* Every log message can have a code that identifies origin
* Codes can move with refactoring and can keep their meaning which is better than different stack traces for the same issue
* Codes can be looked up in the documentation with helpful information for any common first-responders


### Cons

* A small changes like adding a log message is handled with additional complexity in a release
* More documentation needs to be written
