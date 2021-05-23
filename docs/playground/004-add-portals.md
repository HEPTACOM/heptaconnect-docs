# Add more portals

## What is out there?

To discover what other portals you can try out you can query different package and code distributing platforms for the tag `heptaconnect-portal`.


### Add portals from GitHub

Let's take a look at the results at [GitHub](https://github.com/topics/heptaconnect-portal).
You can probably take any repository and clone it into the `/repos/` folder that is at the root directory of the playground.

```shell
git clone https://github.com/example/repo repos/example-repo
composer require -d ./shopware-platform/ example/repo
```

## See the new portals

The best commands to discover the changes within your HEPTAconnect integrated application are:

* `heptaconnect:portal:list` to see your new portal
* `heptaconnect:portal-node:add 'Heptacom\HeptaConnect\Portal\LocalShopwarePlatform\Portal'` to create a new portal node
* `heptaconnect:support:alias:set $THE_NEW_PORTAL_NODE new_alias` to set a human-readable name to the new portal node
* `heptaconnect:portal-node:config:set new_alias api_key` to set a portal node configuration e.g. `api_key`
