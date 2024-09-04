# Add more portals

To discover what other portals you can try out you can query different package and code distributing platforms for the tag `heptaconnect-portal`.


### Add portals from GitHub

Let's take a look at the results at [Packagist](https://packagist.org/search/?tags=heptaconnect-portal).
You can use composer to install new portals into your integration.

```shell
composer require niemand-online/heptaconnect-portal-nasa-apod
```

## See the new portals

The best commands to discover the changes within your HEPTAconnect integrated application are:

* `heptaconnect:portal:list` to see your new portal
* `heptaconnect:portal-node:add 'NiemandOnline\HeptaConnect\Portal\NasaApod\NasaApodPortal' nasa` to create a new portal node with the alias `nasa`
* `heptaconnect:portal-node:config:set nasa api_key …` to set a portal node configuration e.g. `api_key`
