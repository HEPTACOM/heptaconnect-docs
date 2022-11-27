# Filesystem

Next to data moved between portal nodes, there are also files on disk, that count as transaction data.
Ensure to back up and store this data to be accessible from all app servers.


## Locations

When the development team [integrated a non-standard filesystem storage](../integrator/filesystem.md) there are probably setup notes about it.
Otherwise, the [bridge](../integrator/bridges.md) storage fallback is used, which is always a subdirectory within the project directory.
See details about the bridges below.


## Sample configurations

### Shopware 6 Bridge

The Shopware 6 bridge places files in `<instance-dir>/files/plugins/heptaconnect_bridge_shopware_platform/` with a subdirectory for each portal node.

```
<system-root>
└── …
    └── <instance-dir>
        └── files
            └── plugins
                └── heptaconnect_bridge_shopware_platform
                    ├── <portal-node-1>
                    ├── <portal-node-2>
                    └── <portal-node-3>
```

If no changes are done in the integration, you can still move the data outside of this directory.
You can replace a directory with a symbolic link to a directory, that suits better for storage of transaction data.
When used with Docker, the directory `<instance-dir>/files/plugins/heptaconnect_bridge_shopware_platform/` is best a [Docker volume](https://docs.docker.com/storage/volumes/).
When a network storage shall be used, operating system tools like [FUSE](https://www.kernel.org/doc/html/latest/filesystems/fuse.html) can be used to mount network storages like FTP and SMB.  
