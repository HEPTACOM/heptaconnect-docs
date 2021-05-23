# Commandline

## Environments

Your commandline entrypoint depends on the environment you chose before.
See below the binaries to try out:

* Shopware 6 `shopware-platform/bin/shopware`

## First commands

The best commands to discover your HEPTAconnect integrated application are:

* `heptaconnect:portal:list` to see your available portals to connect
* `heptaconnect:portal-node:list` to see your available portal nodes to draw routes between them
* `heptaconnect:portal-node:config:get --pretty bottle` to see a portal node configuration
* `heptaconnect:support:alias:list` to see that the portal node names are just aliases to reduce complexity for configuration and usages
* `heptaconnect:router:list` to see what routes have already been configured

The next step for you should be taking a look at [adding further portals](./004-add-portals.md) to your environment.
