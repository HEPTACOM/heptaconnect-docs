# Portal

|             |       |
| ----------- | ----- |
| Introduced  | 1.0.0 |
| Deprecated  | -     |
| Removed     | -     |
| Replacement | -     |

HEPTAconnect is focused on modularity.
Different packages can be bundled together to adapt it to your needs.
That is why a single adapter to an external system is organized in a dedicated package.
These packages are called portals.
A portal consists of three main components to comply with the HEPTAconnect ecosystem: [Explorers](./explorer.md), [emitters](./emitter.md) and [receivers](./receiver.md).

## Intention

Those three component types are explained in more detail on their respective documentation pages.
Here is a brief explanation of the flow of data through HEPTAconnect:

All of these components connect to their respective portal's data source.
The explorer publishes every object to HEPTAconnect (creating a mapping for each of them).
In the next step HEPTAconnect will pass these mappings to an emitter for it to read the entire object and construct a data set entity.
This object is then passed to the receiver of another portal where it is then written to the data source.

## Usage

A portals job is to register its components and to provide services that are unique for it.
Those services e.g. can be a custom API client or a service that can access data inside a static file.
You can create a portal by implementing PortalContract and referencing your portal class in the extra section of your packages composer.json like this:

```json
"extra": {
    "heptaconnect": {
        "portals": [
            "Foo\\Bar\\Portal"
        ]
    }
},
```

It is required for your package's composer.json to include the keyword `heptaconnect-portal`.
This is the way to let HEPTAconnect know it should take a look at the extra section of your package.

HEPTAconnect is split into different packages to provide great modularity.
As a result your portal package only needs a single composer dependency to be functional: `heptacom/heptaconnect-portal-base`.
This package provides you with all the contracts, structs and services that are relevant for portals while maintaining full system agnosticism.
