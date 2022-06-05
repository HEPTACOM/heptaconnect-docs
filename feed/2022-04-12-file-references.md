{
    "date": "2022-06-07",
    "title": "File reference for direct and fast file transfer",
    "summary": "Tunnel file transfer and make best use of external APIs",
    "author": "Julian Krzefski"
}
---

## TL;DR

- Don't store any files to transfer publicly hosted content
- Tunnel FTP access (and other protocols) through HTTP for more versatile usage
- Avoid obsolete I/O operations whenever possible

With the release of 0.9 we introduce a new feature for portal developers to vastly improve performances of file transfers.
Previously, transferring files always required to write them to an intermediate storage and later read them from this storage again.
The new **FileReferences** will respect the source of a file and choose the optimal transfer method accordingly.
A portal developer can choose from three available file sources:

1. Public URL
    - An HTTP request with the GET method will be responded with the file contents.
      No authentication will be performed.
2. HTTP Request
    - This HTTP request will be responded with the file contents.
      Every aspect of the request can be customized.
3. File contents
    - The raw file contents are provided directly.
      This is the only source that leads to I/O operations in the intermediate storage.

These three strategies already cover many use cases.
Here are some example usages for each source type:

```php
use Heptacom\HeptaConnect\Dataset\Ecommerce\Media\Media;
use Heptacom\HeptaConnect\Portal\Base\Builder\FlowComponent;
use Heptacom\HeptaConnect\Portal\Base\File\FileReferenceFactoryContract;
use League\Flysystem\Filesystem;
use Psr\Http\Message\RequestFactoryInterface;
use Psr\Http\Message\StreamFactoryInterface;

FlowComponent::explorer(Media::class, function (
    FileReferenceFactoryContract $fileReferenceFactory
): iterable {
    $publicUrl = 'https://picsum.photos/seed/php/300/300';
    
    $fileReference = $fileReferenceFactory->fromPublicUrl($publicUrl);

    $mediaEntity = new Media();
    $mediaEntity->setPrimaryKey('ad9e5b8a46364e019d9b3045b5172623');
    $mediaEntity->setFile($fileReference);

    yield $mediaEntity;
});

FlowComponent::explorer(Media::class, function (
    FileReferenceFactoryContract $fileReferenceFactory,
    RequestFactoryInterface $requestFactory,
    StreamFactoryInterface $streamFactory
): iterable {
    $request = $requestFactory
        ->createRequest('POST', 'https://private-image-server.test/api/download-image/28664337703749c49af4bf198e94c396')
        ->withHeader('Authorization', 'Basic aGVwdGFjb25uZWN0OmlzIGNvb2w=')
        ->withBody($streamFactory->createStream(\json_encode([
            'foo' => 'bar'
        ])));

    $fileReference = $fileReferenceFactory->fromRequest($request);

    $mediaEntity = new Media();
    $mediaEntity->setPrimaryKey('ad9e5b8a46364e019d9b3045b5172623');
    $mediaEntity->setFile($fileReference);

    yield $mediaEntity;
});

FlowComponent::explorer(Media::class, function (
    FileReferenceFactoryContract $fileReferenceFactory,
    Filesystem $filesystem
): iterable {
    $fileContents = $filesystem->read('data/images/a2ef9e0ef17e4b3585041ea36c4cde13/1.jpg');

    $fileReference = $fileReferenceFactory->fromContents($fileContents);

    $mediaEntity = new Media();
    $mediaEntity->setPrimaryKey('ad9e5b8a46364e019d9b3045b5172623');
    $mediaEntity->setFile($fileReference);

    yield $mediaEntity;
});
```

We recommend to avoid using the source type "File contents", because it leads to I/O operations and preventing those will greatly improve performance.
In an effort to prevent usages of "File contents" and therefore improve performance, you can utilize **HTTP handlers** to tunnel file downloads through HEPTAconnect.
The idea is to generate a URL with a secret token to be used as "Public URL" file source.
This URL points to an HTTP handler that will perform the file download and return its contents as its response body.
Take a look at the new article [Send files from an FTP server without any intermediate storage](https://heptaconnect.io/guides/portal-developer/patterns/transfer-files-from-ftp-server/) to learn more about this topic and see our example code.
