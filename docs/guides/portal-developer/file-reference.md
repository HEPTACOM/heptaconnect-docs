# File Reference

File references are a way to store information how to access files instead of transferring their content directly.
They are useful to reduce the size of payloads in the management storage when transferring [BLOB](https://en.wikipedia.org/wiki/Binary_large_object)s.


## Strategies

There are two portal node services to handle file references: `\Heptacom\HeptaConnect\Portal\Base\File\FileReferenceFactoryContract` to create a reference and `\Heptacom\HeptaConnect\Portal\Base\File\FileReferenceResolverContract` to resolve a reference.
All resolved file references expose a public URL and the file content, so it can either be consumed by HTTP clients or the data can be read directly and passed to the next storage.
Any access is only done, when used and therefore can throw exceptions.
Currently, there are three strategies available.


### Public URL (HTTP)

A lightweight way to transfer files as a resource is already publicly available.
The reference will only be stored within the payload as there is no need to download it, just to transfer the URL.
To create a file reference by HTTP URL, this method has to be used: `\Heptacom\HeptaConnect\Portal\Base\File\FileReferenceFactoryContract::fromPublicUrl`


### HTTP Request

A way to transfer files as a resource that e.g. are locked behind a login.
The request will be stored serialized in the HEPTAconnect management storage, so it can be read again.
When the data is fetched from the resolved file reference it will be tunneled through HEPTAconnect and the portal node service `\Heptacom\HeptaConnect\Portal\Base\Web\Http\Contract\HttpClientContract`.
It is likely that a stored request is cleaned up, so a resolved reference should be processed in a way, that it does not rely on the public URL for a longer period of time.
To create a file reference by PSR-7 request, this method has to be used: `\Heptacom\HeptaConnect\Portal\Base\File\FileReferenceFactoryContract::fromRequest`


### Raw content

The last resort, that can cover any file transfer.
It will store the content in the HEPTAconnect management storage, so it can be read again.
It is likely that stored raw files are cleaned up, so a resolved reference should be processed in a way that it does not rely on the public URL for a longer period of time.
To create a file reference by content, this method has to be used: `\Heptacom\HeptaConnect\Portal\Base\File\FileReferenceFactoryContract::fromContents`

## Patterns

- [Transfer file reference by public URLs](patterns/transfer-file-reference-by-public-url.md)
