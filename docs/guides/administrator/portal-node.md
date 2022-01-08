# Portal nodes

Portal nodes are the data turning points in an HEPTAconnect instance.
This is where the magic happens.
Multiple nodes of a single portal can exist next to each other and connect to different types and instances of APIs.


## How to create portal nodes

Portal nodes are instances of different portals.
A portal is the set of code that is used to transform common HEPTAconnect structures from and into data source specific structures.
When a portal node is created it can now receive configuration to access the data source and can be used for setting up [data routes](./routing.md).
At first the list of portals should be queried using the `heptaconnect:portal:list` command to see what kind of portal nodes can be created.
The output can look like this:
```markdown
Portals
———————

 ————————————————————————————————————————————————————————————————————————— 
  class                                                                    
 ————————————————————————————————————————————————————————————————————————— 
  Heptacom\HeptaConnect\Integration\Filter\Portal
  Heptacom\HeptaConnect\Integration\Morph\Portal
  Heptacom\HeptaConnect\Portal\LocalShopwarePlatform\Portal
  Heptacom\HeptaConnect\Portal\MayanEdms\Portal
  Heptacom\HeptaConnect\Portal\Shopware5\Portal
  Heptacom\HeptaConnect\Portal\Zammad\Portal
 —————————————————————————————————————————————————————————————————————————
```

The command `heptaconnect:portal-node:add` is used to instantiate a node of a specific portal.

```shell
bin/console heptaconnect:portal-node:add `Heptacom\HeptaConnect\Portal\LocalShopwarePlatform\Portal`
```

As output of the command you will receive the created primary key of the portal node which often looks like this `PortalNode:01234567890abcdef01234567890abcd`.
This can be used later on in other calls when you [create data routes](./routing.md) or inform yourself about [the status of a portal node](./status-reporting.md).


## How to configure portal nodes

Portal nodes often need API credentials or filenames to operate.
To read the initial configuration the command `heptaconnect:portal-node:config:get` is used.
Its output is json and can either be a single value or the complete configuration set:

```shell
bin/console heptaconnect:portal-node:config:get PortalNode:01234567890abcdef01234567890abcd --pretty`
```

```json
{
    "dal_indexing_mode": "none"
}
```

or

```shell
bin/console heptaconnect:portal-node:config:get PortalNode:01234567890abcdef01234567890abcd dal_indexing_mode`
```

```text
none
```

This displays the information of the indexing mode of the underlying API client.
A similar command can be used to change this configuration `heptaconnect:portal-node:config:set`:

```shell
bin/console heptaconnect:portal-node:config:set PortalNode:01234567890abcdef01234567890abcd dal_indexing_mode queue`
```

As we are using json as serialization it is convenient for automated setups.


### Further reading

After you set up multiple portal nodes you can use them in [data routing](./routing.md) and [setup status tracking](./status-reporting.md).
