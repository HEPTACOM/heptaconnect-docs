# FilesystemInterface

Service to convert paths to stream wrapper prefixed URIs for portal node specific file storage access.
It **MUST** be used to generate URIs, that give access to a designated filesystem, that is not shared with other portal nodes. 


## Service

You can get the service by id `Heptacom\HeptaConnect\Portal\Base\File\Filesystem\Contract\FilesystemInterface`.


## Methods

### toStoragePath

Prefixes the path with a portal node unique PHP stream path.


### fromStoragePath

Removes the portal node unique PHP stream path scheme.
