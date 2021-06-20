# HEPTAconnect

> This software is part of HEPTACOM solutions for medium and large enterprises.

In the past we have enabled numerous integrations of third-party systems for Shopware.
Throughout various projects it has become our specialty to connect Shopware with different ERP, CRM or PIM systems used in middle class and enterprise businesses.
But crafting the entire solution from scratch every time has proven to be both time consuming and to some extend repetitive.
That is the reason why we wanted to create a common framework that makes connecting systems easier.

A lot of work went into the concept of this product.
We wanted this foundation to go beyond just Shopware, so we designed it to be system agnostic.
This means that the core of HEPTAconnect can be run in basically any PHP application.
We also provide bridges to popular systems, to reduce redundant code throughout different projects.

## What can it do?

Simply put, HEPTAconnect can speed up the development of your connector to external systems.
By providing a normalized workflow, it lets you focus on the important part of the connector right from the start.
You only need to implement the actual interaction with the external data source and configure some data routes.

## How does it work?

The basic idea of HEPTAconnect is to decouple adapters for different systems from each other.
One adapter (we call these "portals") doesn't know anything about another one.
This makes it possible for platform providers to develop a portal for their platform and distribute it in a modular way.
If you‘re lucky, every system you want to bring together already has an existing portal written for them.

Of course this can only ever work, if all the portals speak a common language.
So we provide an abstraction for various types of information and group them into data sets.
There are multiple data sets available for different applications and portals can choose to support them.
If e.g. a portal for Shopware and a portal for Dynamics 365 Business Central both support the ecommerce data set, they are compatible and can immediately exchange some data.

## What if two portals don't support the same data sets?

If two portals don't share a common supported data set, they are incompatible by normal means.
This changes however, when you provide an intermediate portal to convert data from one type to another.
These intermediate portals are called "morphers".
Technically a morpher is no different that an ordinary portal except its unique job of morphing data from one type to another one.
This makes it possible to connect any portal with any other portal simply by creating a conversion layer between them.

## Is it scalable?

The backbone of HEPTAconnect is a message queue.
This means for any object that is transfered there is a job waiting to be executed by a worker process.
Our tests show a linear scalability when adding more worker processes.
Essentially it depends on the number of CPU cores you throw at it.
So yes, HEPTAconnect scales really well.

## Where can I sign up?

Drop us a mail to [info@heptacom.de](mailto:info@heptacom.de) and ask your questions or choose one of the following news feed formats:
* [RSS](feed/rss2.xml ':ignore')
* [Atom](feed/atom1.xml ':ignore')
* [JSON](feed/json1.json ':ignore')
