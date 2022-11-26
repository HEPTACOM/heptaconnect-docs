# Filesystem

PHP can already access the filesystem, the open question is: where to place files?
Each portal node has a designated location and here is how to access it.


## Concept

Reading and writing files can be a task for a portal.
The storage is not only used by portal developers but the files need also be movable for better administration in different server infrastructures.

To allow [integrators](../integrator/filesystem.md) and [administrators](../administrator/filesystem.md) to safely manage the files, there has to be a way to configure the storage and keep ease of use when accessing files. 
There are different reasons for this directory to be movable e.g. when using a network storage across multiple HEPTAconnect app servers, so we can't just provide access to directory on disk.
To accomplish this portals have the `\Heptacom\HeptaConnect\Portal\Base\File\Filesystem\Contract\FilesystemInterface` service.
Read more in [the ADR](../../reference/adr/2022-10-06-filesystem-stream-wrapper.md) about the concept.


## Protocol

The filesystem is wrapped by a [stream wrapper](https://www.php.net/manual/en/class.streamwrapper.php) to make it interchangeable in terms of the used storage and portal node.
You likely used stream wrappers in PHP, when downloading a file via https e.g. when installing [composer](https://getcomposer.org/download/):

```php
copy('https://getcomposer.org/installer', 'composer-setup.php');
```

This is using a stream wrapper registered on `https` to read remote files.
To get your portal node specific protocol we provide `\Heptacom\HeptaConnect\Portal\Base\File\Filesystem\Contract\FilesystemInterface` as a service with two methods to convert between paths and PHP compatible URIs.


## Location

The location can vary between different integrations.
See the [filesystem integrator guide](../integrator/filesystem.md) to understand how to change and find the used location.


## Patterns

- [List files from filesystem](patterns/list-files-from-filesystem.md)
- [Serve a file from filesystem using HTTP handler](patterns/serve-file-from-filesystem-using-http-handler.md)
