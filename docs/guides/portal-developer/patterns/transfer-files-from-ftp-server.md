# Send files from an FTP server

This pattern will focus on files from an FTP server, but your file source can really be anything.
Let's assume the following problem:

> A PIM system acts as your data source for products and this PIM also holds product images.
> These product images are stored on an FTP server and the PIM only provides you with their file paths on this FTP server.

Files on an FTP server are not accessible via HTTP, so we cannot use the source types "Public URL" or "HTTP request".
So it seems, this leaves us with "File contents" as our last resort.
But this would mean that files are downloaded from the FTP server to an intermediate storage and are later loaded from this intermediate storage to be sent to some destination.

In an effort to eliminate obsolete I/O operations we can utilize **HTTP handlers** to tunnel the FTP access through HTTP.
Instead of downloading the file during exploration, we can instead generate a presigned URL to an HTTP handler that will perform the download later.
We can then use the presigned URL as "Public URL" source.
Here is all you need to make it happen.

```php
use Heptacom\HeptaConnect\Dataset\Ecommerce\Media\Media;
use Heptacom\HeptaConnect\Portal\Base\Builder\FlowComponent;
use Heptacom\HeptaConnect\Portal\Base\File\FileReferenceFactoryContract;
use Heptacom\HeptaConnect\Portal\Base\Portal\Contract\PortalStorageInterface;
use Heptacom\HeptaConnect\Portal\Base\Web\Http\HttpHandlerUrlProviderInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\StreamFactoryInterface;

FlowComponent::explorer(Media::class, function (
    PortalStorageInterface $portalStorage,
    HttpHandlerUrlProviderInterface $urlProvider,
    FileReferenceFactoryContract $fileReferenceFactory
): iterable {
    // Let's assume you query your data source for product media files.
    // Your data source stores media files on a FTP server and this is the file path you get.
    $filePath = 'product-data/images/12890437256/cover.jpg';

    // The plan is to generate a URL that will return the contents of your media file.
    // But the data on the FTP server must still be protected, so we add a secret token to the URL.
    // The URL will only return the image, if the query parameters contain a valid token.
    $secretToken = \bin2hex(\random_bytes(32));

    // We store the token in the portal-storage for 4 hours.
    // After this time the token is automatically invalidated.
    $portalStorage->set(
        $secretToken,
        $filePath,
        new \DateInterval('PT4H')
    );

    // Using the url-provider, we can generate a URL for an HTTP handler called "tunnel/ftp".
    // We pass the token and the file path as query parameters, so the HTTP handler can work with them.
    $presignedUrl = (string) $urlProvider->resolve('tunnel/ftp')->withQuery(\http_build_query([
        'token' => $secretToken,
        'filePath' => $filePath,
    ]));

    // Now we use the file-reference-factory to create a file-reference from our newly generated URL.
    $fileReference = $fileReferenceFactory->fromPublicUrl($presignedUrl);

    $mediaEntity = new Media();
    $mediaEntity->setPrimaryKey('12890437256_cover');
    $mediaEntity->setFile($fileReference);

    yield $mediaEntity;
});

FlowComponent::httpHandler('tunnel/ftp', function (
    ServerRequestInterface $request,
    ResponseInterface $response,
    PortalStorageInterface $portalStorage,
    StreamFactoryInterface $streamFactory,
    FtpDownloader $ftpDownloader
): ResponseInterface {
    // This HTTP handler is supposed to validate a given token and respond with the contents of the requested file path.

    $secretToken = $request->getQueryParams()['token'];
    $filePath = $request->getQueryParams()['filePath'];

    if ($portalStorage->get($secretToken) !== $filePath) {
        // The token is either not valid for the requested file path or has already expired.
        // In this case we do not send any contents but use HTTP code 401 "Unauthorized".
        return $response->withStatus(401);
    }

    // The token is valid for the requested file path.
    // We delete the token now, so the presigned URL is "read-once".
    $portalStorage->delete($secretToken);

    try {
        // Download the file using a ftp-downloader class.
        // The downloader class is not part of HEPTAconnect and must be provided by your portal.
        // Its purpose is to provide a simplified and authenticated FTP client.
        // The implementation is not shown here, because that is not the focus of this example.
        $fileContents = $ftpDownloader->downloadFile($filePath);
        $fileMimeType = $ftpDownloader->getMimeType($filePath);
    } catch (NotFoundException $exception) {
        // The file was not found on the FTP server.
        // We send no contents but use HTTP code 404 "Not Found".
        return $response->withStatus(404);
    }

    // We have successfully downloaded the file from the FTP server.
    // Now we send its contents and mime-type and use HTTP code 200 "OK".
    return $response
        ->withStatus(200)
        ->withHeader('Content-Type', $fileMimeType)
        ->withBody($streamFactory->createStream($fileContents));
});
```
