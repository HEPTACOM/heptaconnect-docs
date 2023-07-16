# 2022-10-06 - Filesystem abstraction with stream wrapper

## Context

From the release of Shopware 5.1 (2015) via the release of Shopware 6.0 developer preview up to the latest version of Shopware 6.4 (2023), which is the latest released version as of writing, [Flysystem](https://github.com/thephpleague/flysystem/tree/1.x) is used as abstraction layer to the filesystem for extensions. 
We started developing HEPTAconnect within the Shopware ecommerce framework, so we followed the same filesystem abstraction guidelines.
With the dependency within Shopware and within HEPTAconnect core to Flysystem v1 we can easily swap the filesystem storage from local disk to memory, AWS S3, Azure Blob Storage, SFTP.
This simplifies administrative tasks to set up auto-scaling app servers accessing a network storage while also running the same code on a small development setup on a local machine.
Flysystem v1 has been completely overhauled with the releases v2 and v3.
As we depend on Shopware integrations we can't use a different Flysystem version.
With the limitation to Flysystem v1 we can only support frameworks, that also support Flysystem v1.
This excludes e.g. Laravel 9.


## Decision

We deprecate and remove later the dependency on `league/flysystem`.
As replacement, we use the even older interface, that did not receive breaking changes in our lifetime of using it: [stream wrappers](https://www.php.net/manual/en/class.streamwrapper.php). 
It is possible to wrap Flysystem with a stream wrapper, so you can keep integrations, that make use of it, without forcing them to switch.
It is possible to wrap stream wrapper with a Flysystem adapter, so you can keep portals, that make use of it, without forcing them to switch.
We need to rewrite portals and integrations regarding their file access.
There is a deprecation release before the removal of Flysystem so one can migrate step by step.


## Consequences

- Portals, that use Flysystem need to be rewritten to access streams, files and the filesystem in a different way


### Pros

- Integrates easier into other frameworks
- Use more native PHP methods, that will work with more libraries, that are not compatible with Flysystem


### Cons

- Stream wrappers are more difficult to debug as the stack trace due to a PHP script calling a PHP method, that internally calls a different user-provided PHP class with a different set of arguments


### How to migrate

#### File listing

###### before

```php
/** @var \League\Flysystem\FilesystemInterface $filesystem */
$files = $filesystem->listContents('', true);
$paths = [];

foreach ($files as $file) {
    $paths[] = $file['path'];
}
```


###### after

```php
/** @var \Heptacom\HeptaConnect\Portal\Base\File\Filesystem\Contract\FilesystemInterface $filesystem */
$fileIterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($filesystem->toStoragePath('/')));
$paths = [];

/** @var SplFileInfo $file */
foreach ($fileIterator as $file) {
    $paths[] = $file->getPath();        
}
```


#### Reading file content

###### before

```php
/** @var \League\Flysystem\FilesystemInterface $filesystem */
$content = $filesystem->read('foobar.txt');
```


###### after

```php
/** @var \Heptacom\HeptaConnect\Portal\Base\File\Filesystem\Contract\FilesystemInterface $filesystem */
$content = file_get_contents($filesystem->toStoragePath('foobar.txt'));
```


#### Writing file content

###### before

```php
/** @var \League\Flysystem\FilesystemInterface $filesystem */
$filesystem->put('foobar.txt', 'Hello world');
```


###### after

```php
/** @var \Heptacom\HeptaConnect\Portal\Base\File\Filesystem\Contract\FilesystemInterface $filesystem */
file_put_contents($filesystem->toStoragePath('foobar.txt'), 'Hello world');
```


#### Moving files

###### before

```php
/** @var \League\Flysystem\FilesystemInterface $filesystem */
$filesystem->rename('foobar.txt', 'gizmo.txt');
```


###### after

```php
/** @var \Heptacom\HeptaConnect\Portal\Base\File\Filesystem\Contract\FilesystemInterface $filesystem */
rename($filesystem->toStoragePath('foobar.txt'), $filesystem->toStoragePath('gizmo.txt'));
```


#### Deleting files

###### before

```php
/** @var \League\Flysystem\FilesystemInterface $filesystem */
$filesystem->delete('foobar.txt');
```


###### after

```php
/** @var \Heptacom\HeptaConnect\Portal\Base\File\Filesystem\Contract\FilesystemInterface $filesystem */
unlink($filesystem->toStoragePath('foobar.txt'));
```
