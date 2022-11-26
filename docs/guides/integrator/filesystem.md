# Filesystem

Portals can make use of the filesystem.
Scaling to an app server cluster expects the use of a network file storage.


## Concept

Reading and writing files can be a task for a portal.
The storage is movable for better administration in different server infrastructures through an abstraction layer for [portal developers](../portal-developer/filesystem.md).
To allow administrators of your project to safely manage the files, there has to be a way to configure the used storage.
By default the bridges store the portal node filesystems in a directory within the project root directory.
When setting up an app server cluster, you need to enable the administrator to configure a network accessible storage.
When changing the storage you should document it properly so the administrator of your project can set up accordingly with the related [administration guide](../administrator/filesystem.md).
Read more in [the ADR](../../reference/adr/2022-10-06-filesystem-stream-wrapper.md) about the concept.


## Sample configurations

### Shopware 6 Bridge

The Shopware 6 bridge exposes itself as a Shopware bundle and makes use of the automatically provided private filesystem.
In general the files are placed in `<instance-dir>/files/plugins/heptaconnect_bridge_shopware_platform/` with a subdirectory for each portal node.

```
<system-root>
└── <instance-dir>
    └── files
        └── plugins
            └── heptaconnect_bridge_shopware_platform
                ├── <portal-node-1>
                ├── <portal-node-2>
                └── <portal-node-3>
```

We suggest to control the storage location by following the [hosting guide from Shopware](https://developer.shopware.com/docs/guides/hosting/infrastructure/filesystem) on the shared filesystem.


## Patterns

- [Change the filesystem for a specific portal node](patterns/filesystem-change-for-specific-portal-node.md)
