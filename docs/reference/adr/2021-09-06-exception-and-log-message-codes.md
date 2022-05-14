# 2021-09-06 - Exception and log message codes

## Context

Making log message that help is difficult for various reason.
You can not be sure which role persona will read them (either administrator, integrator or portal developer).
Therefore, phrasing a good message takes additional thoughts.
Log messages in general just have a single line of text and some human-readable metadata that are crammed into the same line of text.
This little space sometimes let out some data that are crucial to find the reason of an error log message.
Most log messages are written when an exception is caught.
Exceptions can have integer codes assigned.
Exception codes are set on construction, which is in almost all cases the moment they are thrown.


## Decision

Exception stack traces are too big for log messages.
So we need to refer to them in a different way.
When we pass a unique code to the exception constructor, we can identify the source code that triggers the exception very easy.
This makes exception codes a good alternative to stack traces.
Every log message, that is not related to catching an exception, has no code from an exception.
These message can benefit from a code that is structured the same to identify their origin.
Exception codes and log message codes need documentation with a class reference and a reason for occurrence to supply information for an administrator and a developer.


## Consequences

### Pros

* Every log message can have a code that identifies origin
* Codes can move with refactoring and can keep their meaning which is better than different stack traces for the same issue
* Codes can be looked up in the documentation with helpful information for any common first-responders


### Cons

* Codes are public API
* More documentation needs to be written
