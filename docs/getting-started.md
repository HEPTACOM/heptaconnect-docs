# Getting Started

There are two ways to quickly get started with HEPTAconnect. If you would like a setup with pre-configured portals and a working runtime, you should check out the playground. If you want to develop your own packages for HEPTAconnect, you should install the SDK first.

## Playground

The playground is a minimal Shopware 6 system with a build-in integration for HEPTAconnect. This is a great way to showcase what HEPTAconnect can do today and to learn about the intentions and internal processes of the system. You can install it like so.

```sh
git clone git@github.com:HEPTACOM/heptaconnect-playground.git
cd heptaconnect-playground
make shopware-platform
```

This setup has these requirements for your host system:

* Make
* PHP >= 7.4
* Composer >= 1.8
* MySQL >=5.7

It is also assumed that your MySQL server is accessible with the following credentials: `mysql://root:root@localhost:3306/heptaconnect_shopware_platform`. If your MySQL server has different credentials, you can change it in `shopware-platform/.env` by editing the `DATABASE_URL`

The playground comes with a fully functional example portal and data set. This portal uses static data as its data source. While this will probably never be an actual use-case, it makes things very predictable and easy to comprehend.

## SDK

The SDK is similar to the playground as it also comes with a minimal Shopware 6 system as its runtime. But here it is even more trimmed down to focus on the development of HEPTAconnect packages. It also comes with some utility commands designed to improve the developer experience.

You can install the SDK in a directory of your choice. Upon installation it will create a symlink to the `heptaconnect-sdk` binary file in a directory of your `PATH` environment variable, so you can access it from anywhere in your terminal using `heptaconnect-sdk`. Start the installation like so.

```sh
composer create-project heptacom/heptaconnect-sdk:dev-master heptaconnect-sdk
```

If you are using Composer 2.x, the installation wizard should start immediately. If you are using Composer 1.x, it will ask you to execute the wizard manually using this command.

```sh
heptaconnect-sdk sdk:install
```

The installation wizard will ask you for database credentials of your MySQL server. Afterwards it will setup the database.

?> ✅ Great job! You installed the SDK. Let's make a package now.

### Building your own portal

Initialize a new package using the SDK. This will start a short questionnaire to gather information about your package.

```sh
heptaconnect-sdk sdk:package:init <target-dir>
```

The SDK will ask you a few questions about your new package and prepare your project accordingly. You can choose between creating a dataset, a portal and a storage. In this example we create a portal package.

```
 Choose the type of package you want to build:
  [0] heptaconnect-dataset
  [1] heptaconnect-portal
  [2] heptaconnect-storage
 > heptaconnect-portal

 Give your package a name. [<my-username>/<target-dir>]:
 > example-vendor/my-portal-package

 Specify a PSR-4 compliant namespace. [ExampleVendor\MyPortalPackage]:
 > 

Loading composer repositories with package information
Updating dependencies
...
```

Your `<target-dir>` should now have the following contents:

```
<target-dir>
├── composer.json
├── composer.lock
├── src
│   └── Portal.php
└── vendor
    └── autoload.php
    └── ...
```

?> ✅ You successfully created your first portal!

### Adding your package to the SDK runtime

You now have a shiny new package and can start developing. When you want to execute your code in a HEPTAconnect runtime to see if it works, you first have to add the package to your SDK installation. This will make the SDK aware of your package and you can then use commands in the `heptaconnect` namespace with your package. Run this command to add your package.

```sh
heptaconnect-sdk sdk:package:add <target-dir>
```

You should see Composer updating the SDK with your package as a dependency. The SDK will now load your package with every command you execute. You can verify this (for portals) by running this command.

```sh
heptaconnect-sdk heptaconnect:portal:list
```

?> ✅ Your portal is now available in the SDK!
