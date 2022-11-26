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
use Heptacom\HeptaConnect\Portal\Base\StorageKey\Contract\PortalNodeKeyInterface;
use Heptacom\HeptaConnect\Storage\Base\Contract\StorageKeyGeneratorContract;
use League\Flysystem\Adapter\Ftp;
use League\Flysystem\Filesystem;

class PortalNodeFilesystemStorageFactory extends FilesystemFactory
{
    private StorageKeyGeneratorContract $storageKeyGenerator;
    
    private FilesystemFactory $decorated;

    private string $ftpDsn;

    public function __construct(
        StorageKeyGeneratorContract $storageKeyGenerator,
        FilesystemInterface $filesystem,
        FilesystemFactory $decorated,
        string $ftpDsn
    ) {
        parent::__construct($storageKeyGenerator, $filesystem);

        $this->storageKeyGenerator = $storageKeyGenerator;
        $this->decorated = $decorated;
        $this->ftpDsn = $ftpDsn;
    }

    public function factory(PortalNodeKeyInterface $portalNodeKey): FilesystemInterface
    {
        $portalNodeAlias = $this->storageKeyGenerator->serialize($portalNodeKey->withAlias());

        if ($portalNodeAlias !== 'portal-node-a') {
            return $this->decorated->factory($portalNodeKey);
        }
        
        if ($this->ftpDsn === '') {
            return $this->decorated->factory($portalNodeKey);
        }
        
        $dsnParts = parse_url($this->ftpDsn);

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


###### src/Resources/config/services.xml

```xml
<?xml version="1.0" ?>
<container
    xmlns="http://symfony.com/schema/dic/services"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://symfony.com/schema/dic/services http://symfony.com/schema/dic/services/services-1.0.xsd"
>
    <services>
        <service
            decorates="Heptacom\HeptaConnect\Core\Storage\Filesystem\FilesystemFactory"
            id="Heptacom\HeptaConnect\Production\Core\PortalNodeFilesystemStorageFactory"
            parent="Heptacom\HeptaConnect\Core\Storage\Filesystem\FilesystemFactory"
        >
            <argument index="2" type="service" id="Heptacom\HeptaConnect\Production\Core\PortalNodeFilesystemStorageFactory.inner"/>
            <argument index="3" type="string">%env(string:PORTAL_NODE_A_FTP_DSN)%</argument>
        </service>
    </services>
</container>
```


###### .env

```dotenv
PORTAL_NODE_A_FTP_DSN=ftp://user:pass@other-server/subdir
```
