# List files from filesystem

This pattern shows how to:

- To access portal node specific filesystem using the [FilesystemInterface](../filesystem.md)

## Portal

###### src/Resources/flow-component/list-files.php

```php
<?php

declare(strict_types=1);

use Heptacom\HeptaConnect\Portal\Base\Builder\FlowComponent;
use Heptacom\HeptaConnect\Portal\Base\File\Filesystem\Contract\FilesystemInterface;
use Heptacom\HeptaConnect\Portal\Base\StatusReporting\Contract\StatusReporterContract;

FlowComponent::statusReporter(StatusReporterContract::TOPIC_INFO)
    ->run(static function (FilesystemInterface $fs): array {
        $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($fs->toStoragePath('/')));
        $paths = [];
        
        /** @var \SplFileInfo $file */
        foreach ($files as $file) {
            $paths[] = $file->getPath();        
        }
    
        return [
            StatusReporterContract::TOPIC_INFO => true,
            'files' => $paths,
        ];
    });
```
