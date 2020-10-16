# 2020-10-15 - Portal status reporters

## Context

A portal should have some kind of status page. It has to tell an administrating person and a health check automation whether the portal is in a good state.

A good state can differ from the point of perspective. A configuration might be syntactically correct but is not able to setup an IO connection to the datasource.

## Decision

* A portal and the portal extension have to be able to provide new status topics and have impact on the contents they report
* Every reporter has to expose JSON serializable content for easy automation access
* Every reporter should expose a boolean value keyed with the topics' key to determine whether the report displays a good state
* Every portal should expose a status reporter for topic `healthy` when the portal interacts with a datasource connected via IO operations to determine correct configuration and connectivity 
* Portal extensions have to prefix their own keys they expose with a reasonable 
* Every topic should be accessible on their own
* A status report should act fast and use as little IO operations as possible to allow frequent health checks
* A status report should be promoted for the following use cases:
    * static information that are not part of the providing composer package
    * health check of the datasource connection
    * portal internal behaviour analysis (last time usage, remained API called by time limitations)
    * configuration support

## Consequences

### Pros

* This way a portal has now a data transportation independent way to expose data
* Automated processes and humans can process this data
* Health checks can be implemented in a standardized way for every portal
* Multistep configuration is easier to provide
* Internal API usage can be exposed for behaviour analysis
 
### Cons
 
* It can be misused for data reading that does not belong to the intended use cases   

### How to use

A command like `heptaconnect:portal-node:status PortalNode:123 health | jq -e .health` as a simple health check condition can be setup as crontab entry.
An other example is `heptaconnect:portal-node:status PortalNode:123 config` to display possible values for further configuration. 
