# Playground

## What is that?

The playground is a quick entry for getting your hands onto HEPTAconnect in action.

When you want to …
* use HEPTAconnect for the first time, … 
* try out a portal you found online, …
* debug into some default HEPTAconnect flows, …
* contribute to the HEPTAconnect packages itself and need a basic environment, …

this is where you should be able to try it without building an integrated system yourself.
The playground comes with a fully functional example portal and data set: the bottle portal.
This portal uses static data as its data source.
While this will probably never be an actual use-case, it makes things very predictable and easy to comprehend.


## What can I expect?

You can find different running project based on skeletons that are populated with some basic configuration.
Choose your matching environment and try it on your local machine.
To get started see our [first time with playground](./002-first-time.md) articles.
When you are already familiar with HEPTAconnect you can use it to [contribute](./005-contribution.md) to the packages.


## What will I miss?

There are …
* no optimized message brokers configured
* no additional caching techniques
* no cluster configurations
* public "secrets" that must not be used in production environments

Having an easy entry with predefined configurations has it drawbacks for other cases.
You should not expect these project skeletons to be similar to a production ready environment.
They are configured to be run on a single machine with only a few additional dependencies to lower the initial hurdle.
