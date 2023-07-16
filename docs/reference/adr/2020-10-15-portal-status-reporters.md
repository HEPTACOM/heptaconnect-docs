# 2020-10-15 - Portal status reporters

## Context

A portal should have some kind of status page.
It has to tell an administrating person and a health check automation whether the portal is in a good state.

A good state can differ from the point of perspective.
A configuration might be syntactically correct but is not able to setup an I/O connection to the datasource.

## Decision

* A portal and the portal extension have to be able to provide new status topics and have impact on the contents they report.
* Every reporter has to expose JSON serializable content for easy automation access.
* Every reporter should expose a boolean value keyed with the topics' key to determine whether the report displays a good state.
* Every portal should expose a status reporter for topic `health` when the portal interacts with a datasource connected via I/O operations to determine correct configuration and connectivity.
* Portal extensions have to prefix their own keys they expose with a reasonable identifier.
* Every topic should be accessible on their own.
* A status report should act fast and use as little I/O operations as possible to allow frequent health checks.
* A status report should be promoted for the following use cases:
    * static information that are not part of the providing composer package
    * health check of the datasource connection
    * portal internal behaviour analysis (last time usage, remaining API calls by time limitations)
    * configuration support

## Consequences

### Pros

* A portal has a way to expose data independently of data transportation.
* Automated processes and humans can process this data.
* Health checks can be implemented in a standardized way for every portal.
* Multi-step configuration is easier to provide.
* Internal API usage can be exposed for behaviour analysis.
 
### Cons
 
* It can be misused for data reading that does not belong to the intended use cases.

### How to use

A command like `heptaconnect:portal-node:status PortalNode:123 health | jq -e .health` as a simple health check condition can be setup as crontab entry.
An other example is `heptaconnect:portal-node:status PortalNode:123 config` to display possible values for further configuration.

Regarding the usage of behaviour analysis it is suggested to compare the intended functionality to be achieved is compared against the [telemetry feature](./2020-01-27-telemetry-recording.md) as this allows a very specific way to deal with behaviour analysis.
