# Status reporting

Status reports are the tools to build your status page for your HEPTAconnect installation.
They are developed by [portal developers](../portal-developer/status-reporting.md) for capturing metrics.


## Common metrics

HEPTAconnect suggests portal developers to supply status reports for the following topics:

* health: Health status reports are used to test configurations against the underlying portal data source to track availability and connectivity
* analysis: Analysis status reports are used for API usage rates or different self detected behaviour metrics
* info: A generic set of information that is helpful right after installation
* config: A set of information for configuration support like generated API endpoints

To have a detailed look into the thoughts of status reports have a read into [the corresponding ADR](../../reference/adr/2020-10-15-portal-status-reporters.md).


## How to use

The fastest way in setup is a health tracker using a crontab configuration.
It will use a regular check on the portal and use crontab mailing feature to inform about an unhealthy portal.
A call to the status report command `heptaconnect:portal-node:status` filtered through [jq](https://stedolan.github.io/jq/) with the -e exit code option easily convert the health result into something processable in a shell.

```shell
bin/console heptaconnect:portal-node:status PortalNode:123 health | jq -e .health
```
