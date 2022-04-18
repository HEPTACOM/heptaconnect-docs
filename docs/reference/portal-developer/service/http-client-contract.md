# HttpClientContract

HTTP client that wraps around the [PSR-18](https://www.php-fig.org/psr/psr-18/) [`Psr\Http\Client\ClientInterface`](../../../guides/portal-developer/default-utilities.md#clientinterface) with configurable behaviour for common use-cases.


## Service

You can get the service by id `Heptacom\HeptaConnect\Portal\Base\Web\Http\Contract\HttpClientContract`.
It is preconfigured to throw exceptions for status codes between 400 and 599, follow redirects up to 20 times and retry twice in case of an error or rate limit.


## Methods

### getDefaultRequestHeaders

Get the request header configurations that are applied to any request unless they are already present.


### withDefaultRequestHeaders

Set the request header configurations that are applied to any request unless they are already present.
As it returns a new instance of itself, you **SHOULD** process its return value.


### getExceptionTriggers

Get the HTTP response status codes that will throw an exception.


### withExceptionTriggers

Add HTTP response status codes that will throw an exception.
As it returns a new instance of itself, you **SHOULD** process its return value.


### withoutExceptionTriggers

Remove HTTP response status codes, so they will not throw an exception.
As it returns a new instance of itself, you **SHOULD** process its return value.


### getMaxRedirect

Get the number of automatically followed redirects.
Defaults to 0.


### withMaxRedirect

Sets the number of automatically followed redirects.
As it returns a new instance of itself, you **SHOULD** process its return value.


### getMaxRetry

Get the number of automatically processed retries.
Defaults to 0.


### withMaxRetry

Sets the number of automatically processed retries.
As it returns a new instance of itself, you **SHOULD** process its return value.


### getMaxWaitTimeout

Get the maximum time in seconds allowed to wait between retries per HTTP status code.


### withMaxWaitTimeout

Add the maximum time allowed timeout in seconds for an HTTP status code.
As it returns a new instance of itself, you **SHOULD** process its return value.


### withoutMaxWaitTimeout

Remove the wait timeout for an HTTP status code.
As it returns a new instance of itself, you **SHOULD** process its return value.
