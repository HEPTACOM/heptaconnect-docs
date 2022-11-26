# Change the filesystem for a specific portal node

This pattern shows how to:

- Use Flysystem v1 to connect to an FTP server. Learn more in the [Flysystem documentation](https://flysystem.thephpleague.com/v1/docs/adapter/ftp/).
- Decorate a service to return an FTP connection as storage for a specific portal node
- Identify portal nodes within an integration


## Integration

###### src/Core/PortalNodeFilesystemStorageFactory.php

```php
<?php

declare(strict_types=1);

namespace Heptacom\HeptaConnect\Production\Core;

use Heptacom\HeptaConnect\Core\Storage\Filesystem\FilesystemFactory;
use League\Flysystem\Adapter\Ftp;
use League\Flysystem\Filesystem;

class PortalNodeFilesystemStorageFactory extends FilesystemFactory
{
    private StorageKeyGeneratorContract $storageKeyGenerator;
    
    private FilesystemFactory $decorated;

    public function __construct(
        StorageKeyGeneratorContract $storageKeyGenerator,
        FilesystemInterface $filesystem,
        FilesystemFactory $decorated
    ) {
        parent::__construct($storageKeyGenerator, $filesystem);

        $this->storageKeyGenerator = $storageKeyGenerator;
        $this->decorated = $decorated;
    }

    public function factory(PortalNodeKeyInterface $portalNodeKey): FilesystemInterface
    {
        $portalNodeAlias = $this->storageKeyGenerator->serialize($portalNodeKey->withAlias());

        if ($portalNodeAlias !== 'portal-node-a') {
            return $this->decorated->factory($portalNodeKey);
        }
        
        $portalNodeFtpDsn = getenv('PORTAL_NODE_A_FTP_DSN');
        
        if ($portalNodeFtpDsn === '') {
            return $this->decorated->factory($portalNodeKey);
        }
        
        $dsnParts = parse_url($portalNodeFtpDsn);

        return new Filesystem(new Ftp([
            'host' => $dsnParts['host'],
            'username' => $dsnParts['user'],
            'password' => $dsnParts['pass'],
            'port' => $dsnParts['port'] ?? 21,
            'root' => $dsnParts['path'] ?? null,
            'passive' => true,
            'ssl' => true,
        ]));
    }
}
```
