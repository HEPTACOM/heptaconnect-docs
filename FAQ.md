# FAQ - Frequently asked questions

## What minimum frequency for the cronjobs is supported?

In the best case no cronjob is needed at all.
The main goal is to work on events to achieve an almost live transfer can be achieved and no keep-updated cronjob is required.
There are portals that need cronjobs as their system does not support events on changes by default. 

## Why is there no mono-repository?

Connecting everything inherits requiring a lot of dependencies 

## Can I add custom structures?

Yes, every dataset provider can provide new dataset entities that can be managed by HEPTAConnect.

## Can I add data to existing structures?

Yes, every connectable structure has a field for additional data that any service can read and change to their needs.
This allows changes for systems that do not follow the given standard from a dataset.
