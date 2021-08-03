# First time HEPTAconnect with Shopware 6

## Features

When you choose to use a Shopware 6 as environment you have:

* Shopware 6 integration, commandline and administration
* Preconfigured Shopware 6 portal node (alias `shopware`)
* Preconfigured Bottle portal node (alias `bottle`)
* Preconfigured administration credentials (user `admin` password `shopware`)


## Check system

To have your first Shopware 6 setup in your playground copy you need to fulfil the following requirements:

* PHP 7.4+
* Composer 2+
* At least 256MB memory limit for PHP processes
* Shopware 6 suitable database (e.g. MySQL 5.7, see [their requirements](https://developer.shopware.com/docs/guides/installation/overview#system-requirements))

When you have an environment that supports hosting of a PHP application you can point it to the directory as root `shopware-platform/public`.
The default settings for the database credentials are:

* **user** – `root`
* **password** – `root`
* **host** – `localhost`
* **port** – `3306`
* **database** – `heptaconnect_shopware_platform`

When this differs from your available database you can change an environment variable to override the default connection.
```shell
DATABASE_URL=mysql://root:root@localhost:3306/heptaconnect_shopware_platform
```
Either change the entry in the `shopware-platform/.env` or `export` that statement for a single shell session.

## Set up the playground

Now when the prerequisites are met you can run:
```shell
make shopware-platform
```
and watch your shop set up automatically.
Later on you have a Shopware 6 CLI available at `shopware-platform/bin/shopware`.
When you configured hosting you can use the shopware administration under your URL `/admin`.

Keep in mind that this Shopware does not run any queue workers by default.
In case you want to transfer data in that environment you have to run:
```shell
shopware-platform/bin/shopware messenger:consume
```
