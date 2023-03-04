# HTTP Client Middleware

> Since heptacom/heptaconnect-portal-base: 0.9.2

A portal, that connects to an HTTP API regularly needs to add headers, session handling or customized response handling, for every request/response.
To provide features like this for multiple HTTP requests, you can use these middlewares.


## Intention

Shared code will occur with more and more different API calls an HTTP Client is used for.
Authenticated session handling is a common case, that can be solved by wrapping each sending of a request and ensure to use an authenticated session identifier.
This is where the HTTP Client Middlewares come into play.

Intercepting outbound HTTP requests is already simplified, when using the shipped [HTTP Client](../../reference/portal-developer/service/http-client-contract.md), or defining a decorator for the [`PSR-18`](https://www.php-fig.org/psr/psr-18/) HTTP Client.
With this HTTP Client Middleware it is simpler to build decorations around the HTTP Client as only a single file is needed with less potential to do it wrong.
The underlying interface is similar to the [`PSR-15`](https://www.php-fig.org/psr/psr-15/) middleware interface but for outbound HTTP requests.


## Usage

Services of type `\Heptacom\HeptaConnect\Portal\Base\Web\Http\Contract\HttpClientMiddlewareInterface` will automatically get the service tag `heptaconnect.http.client.middleware`.
All services with the tag `heptaconnect.http.client.middleware` will be executed for each request, that is sent by the `Psr\Http\Client\ClientInterface` service.
Adding a single file to your code will be sufficient for reoccurring tasks of your HTTP client.
See [this pattern for dumping message](./patterns/http-client-middleware-dumping-on-bad-request.md) or like the following example for profiling:


```php
use Heptacom\HeptaConnect\Portal\Base\Profiling\ProfilerContract;
use Heptacom\HeptaConnect\Portal\Base\Web\Http\Contract\HttpClientMiddlewareInterface;
use Psr\Http\Client\ClientInterface;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;

final class ProfilerMiddleware implements HttpClientMiddlewareInterface
{
    private ProfilerContract $profiler;

    private bool $profilingEnabled;

    public function __construct(ProfilerContract $profiler, bool $configProfilingEnabled)
    {
        $this->profiler = $profiler;
        $this->profilingEnabled = $configProfilingEnabled;
    }

    public function process(RequestInterface $request, ClientInterface $handler): ResponseInterface
    {
        if (!$this->profilingEnabled) {
            return $handler->sendRequest($request);
        }

        $this->profiler->start(\sprintf('http client %s %s', $request->getMethod(), $request->getUri()));

        try {
            $response = $handler->sendRequest($request);
        } catch (\Throwable $exception) {
            $this->profiler->stop($exception);

            throw $exception;
        }

        $this->profiler->stop();

        return $response;
    }
}
```
