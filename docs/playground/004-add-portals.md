# Add more portals

## What is out there?

To discover what other portals you can try out you can query different package and code distributing platforms for the tag `heptaconnect-portal`.

### Add portals from GitHub
Let's take a look at the results at [GitHub](https://github.com/topics/heptaconnect-portal).
This will contain our [local-shopware-platform](https://github.com/HEPTACOM/heptaconnect-portal-local-shopware-platform) that can be used within a Shopware 6 application as self-hosted app/plugin.

Let's see how we can get it in there.
In that example I will add it to the shopware-platform project within the playground.
You have to adjust paths to your project.
```shell
composer config -d ./shopware-platform/ repositories.local-shopware-platform vcs https://github.com/HEPTACOM/heptaconnect-portal-local-shopware-platform
composer require -d ./shopware-platform/ heptacom/heptaconnect-portal-local-shopware-platform
```

## See the new portals

The best commands to discover the changes within your HEPTAconnect integrated application are:

* `heptaconnect:portal:list` to see your new portal
* `heptaconnect:portal-node:add 'Heptacom\HeptaConnect\Portal\LocalShopwarePlatform\Portal'` to create a new portal node
* `heptaconnect:support:alias:set $THE_NEW_PORTAL_NODE new_alias` to set a human-readable name to the new portal node
* `heptaconnect:portal-node:config:set new_alias api_key` to set a portal node configuration e.g. `api_key`
