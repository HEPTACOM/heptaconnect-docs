# 2021-10-30 - Route capabilities

## Context

Routes define directions for data to flow.
The interpretation or use-case for a flow can be different for various reasons.
In general, we support read-multiple-times write-multiple-times scenarios, and they are very generous in options to work with but often needs to be limited in integrations.
Limitations like transferring data only once or transferring data for finding the equivalent on the target are missing but requested.
We need a way to configure route behaviour in core without adding more work to the integrators.


## Decision

All limitations (e.g. transferring once) will be implemented as skipping existing steps.
These changes in behaviour can be represented by simple boolean flags.
Every step that is not a limitation will result in further flow components that will get a boolean flag.


## Consequences

### Pros

* Common known and implemented behaviours can be handled more globally and applied to any route
* This allows for wide range of operations portal developers can provide which can be combined later on by configuration
