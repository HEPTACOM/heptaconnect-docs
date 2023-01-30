# HTTP APIs

HEPTAconnect itself and portals expose HTTP endpoints for various actions.
To ensure correct hosting and exposure of these endpoints you can read everything you need in here.


## Base URL

The bridges define the integration of HEPTAconnect in the surrounding application it got embedded into.
To see which base URL is used by HEPTAconnect you can use the command `heptaconnect:config:base-url:get`.
When it does not match the expectations you can use the command `heptaconnect:config:base-url:set` to change it.


## Endpoint listing

Portals can resolve the absolute URLs for their registered endpoints.
There is the command `heptaconnect:http-handler:list-handlers` to display the registered endpoints.
The output looks like this:

```markdown
 ————————————— ————————————— ——————————————————————————————————————————————————————————————————————————
  portal-node   path          url
 ————————————— ————————————— ——————————————————————————————————————————————————————————————————————————
  bottle        hello-world   http://example.com/api/heptaconnect/flow/bottle/http-handler/hello-world
 ————————————— ————————————— ——————————————————————————————————————————————————————————————————————————
```


## Enabled and disabling handlers

By default, every HTTP handler is enabled.
In a scenario where the web activity needs to be disabled, you can use `heptaconnect:http-handler:set-configuration bottle hello-world enabled false` to set the handler's enabled configuration on path `hello-world` for portal node `bottle` to deactivate it.
In a similar way you can look up the enabled configuration: `heptaconnect:http-handler:get-configuration bottle hello-world enabled`.


## Debugging

For investigation purposes you can dump the HTTP requests and responses of the HTTP handlers.
To do so you can use the configuration key `bridge-dump-sample-rate` to set the sampling rate.
The expected value is an integer between 0 and 100.
By default, the sampling rate is set to 0, which means no requests are dumped.
To dump all requests you can set the sampling rate to 100.
E.g. to set the configuration to 3/4 of the requests get recorded you can use the command `heptaconnect:http-handler:set-configuration bottle hello-world bridge-dump-sample-rate 75`.
The dumped requests are stored on filesystem next to your log files.
