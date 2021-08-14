# Portals

Portals are the pieces of code to connect your HEPTAconnect instance to other APIs for data transfer.
They are most likely installed via composer or as a plugin in your integration (e.g. Shopware 6).


## How to get a portal?

There are multiple sources for portals.
Some of them are available as open source on [GitHub](https://github.com/topics/heptaconnect-portal) and [packagist](https://packagist.org/?tags=heptaconnect%20portal) like our [Shopware 6 portal](https://github.com/HEPTACOM/heptaconnect-portal-local-shopware-platform).
There are many client specific implementations for known and custom APIs we (HEPTACOM GmbH) and our HEPTAconnect partners developed in the past.
To get information on our previous work and our solutions for your connector project [contact us](https://www.heptacom.de/kontakt/) by emailing us to [info@heptacom.de](mailto:info@heptacom.de?subject=HEPTAconnect%20portal).


## Develop your own

When you want to develop your portal you can move over from this integrator section over to the [portal developer section](../portal-developer/index.md).
There you can find an extensive explanation of all the tools at hand that you need.


## Usage

When you got access to your portal of choice you can now use composer to install it in your integration.
To check whether it got recognized correctly you can check `heptaconnect:portal:list` to list all your installed portals.
Following by that you can create portal nodes from this portal with the command `heptaconnect:portal-node:add $FQCN`.
Learn more about [administering portal nodes in the administrator section](../administrator/portal-node.md).

There are good reasons to alter the behaviour of an existing portal.
For this task you use portal extensions.
They allow you to completely change the behaviour of any portal and can be mixed with other portal extensions as well.
Learn more about decorated flow components like [explorers](../portal-developer/explorer-decoration.md), [emitters](../portal-developer/emitter-decoration.md) and [receivers](../portal-developer/receiver-decoration.md) in the [portal developer section](../portal-developer/index.md).
Learn more about the reasons why and when it is useful to create portal extensions for [data tuning](./data-tuning.md).
