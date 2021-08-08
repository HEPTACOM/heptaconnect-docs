{
    "date": "2021-05-23",
    "title": "HEPTAconnect and playground support for Shopware 6.4",
    "summary": "The playground supports Shopware 6.4 and the docs will tell you how to use it in just a few steps",
    "author": "Joshua Behrens"
}
---

A wave of huge changes hit the playground and ironed some kinks.

**The major update at Shopware from 6.3 to 6.4 has been rolled out onto the HEPTAconnect packages.**
To experience Shopware 6.4 with HEPTAconnect you can now easily grab yourself a fresh copy of the [playground](https://heptaconnect.io/guides/playground/introduction/) and dive in. 
To allow the playground be used with your [familiar ecommerce framework](https://heptaconnect.io/guides/playground/first-time/with-shopware-6/) in a more complete manner you will now find an integrated `shopware/administration`.
This way you can use the playground to fiddle with HEPTAconnect within Shopware and in addition also with Shopware itself after importing your favorite data.

**How to get your favorite data in, you might ask?**
Just use the bundled shopware platform portal.
On creating the shopware instance in the playground you will get a portal node for the shopware instance as well as for the artificial portal for bottles.
Require other portals you can already find online on GitHub under the tag [heptaconnect-portal](https://github.com/topics/heptaconnect-portal) into the shopware composer.json.
They are automatically discovered for you to draw your first routes between the portal nodes.

**What is that /repos/ folder at root level?**
We had a look at the [contribution and experimenting flow](https://heptaconnect.io/guides/playground/contribution/) we currently provide and chose to rework that.
The new folder contains every HEPTAconnect package as a clone from GitHub.
They are linked into the vendor folder.
Having the different packages on this directory level makes it much easier to discover and change HEPTAconnect.
As they are clones from GitHub it also allows a direct way to share your work on HEPTAconnect in a bleeding edge manner.

**How can you know all of this?** The documentation got a truck load of new content about:
* [the playground](https://heptaconnect.io/guides/playground/introduction/)
* [commands](https://heptaconnect.io/guides/playground/command-line/)

Some of these new pages are also linked within this article so have a look around.
