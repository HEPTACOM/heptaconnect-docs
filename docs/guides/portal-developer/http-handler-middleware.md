# HTTP Handler Middleware

> Since heptacom/heptaconnect-portal-base: 0.9.2

A portal can respond to an HTTP request using [HTTP Handlers](./http-handler.md).
To provide features for multiple HTTP handler, you can use these middlewares.


## Intention

With more and more implementations of HTTP handlers, shared code will occur e.g. authentication check, logging and profiling.
To share this code you can either copy code snippets or use extracted services over and over again.
With HTTP middlewares known from [`PSR-15`](https://www.php-fig.org/psr/psr-15/) you can also write code that intercept every inbound HTTP request for your HTTP handlers. 


## Usage

Services of type `\Psr\Http\Server\MiddlewareInterface` will automatically get the service tag `heptaconnect.http.handler.middleware`.
All services with the tag `heptaconnect.http.handler.middleware` will be executed before an [HTTP Handler](./http-handler.md) will receive the request.
By adding a file to your code like the following will be sufficient to add a "portal node"-wide place to add reoccurring tasks for your HTTP handlers like e.g. profiling:


```php
use Heptacom\HeptaConnect\Portal\Base\Profiling\ProfilerContract;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

final class ProfilerMiddleware implements MiddlewareInterface
{
    private ProfilerContract $profiler;

    public function __construct(ProfilerContract $profiler)
    {
        $this->profiler = $profiler;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $this->profiler->start(\sprintf('http handler %s %s', $request->getMethod(), $request->getUri()));

        try {
            $response = $handler->handle($request);
        } catch (\Throwable $exception) {
            $this->profiler->stop($exception);

            throw $exception;
        }

        $this->profiler->stop();

        return $response;
    }
}
```
