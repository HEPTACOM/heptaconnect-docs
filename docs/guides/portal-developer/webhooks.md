# Webhook

|             |       |
| ----------- | ----- |
| Introduced  | 1.0.0 |
| Deprecated  | -     |
| Removed     | -     |
| Replacement | -     |

Webhooks can be powerful tools when it comes to enabling real-time data transfers from external data sources.
They are a common way for various platform providers to notify external systems about a modification of data.
HEPTAconnect enables portals to use webhooks to react to such notifications.

The webhook service is available via the [service discovery](#) and can be used to register a webhook.
When a web request to the corresponding url is executed, the registered handler will be called.

## Intention

Webhooks are designed to be used by portals that connect to external systems that support webhooks in any way.
Basically, this allows a portal to listen to incoming web requests and react to them accordingly.
For the best versatility a webhook handler recieves the http request in the form of a PSR-7 request object and is obligated to return a PSR-7 response object.
A typical implementation of a webhook handler could determine, which object the request correlates to and then [issue a publication](#) of that object.

Also, while not explicitly intended, it is entirely possible to send actual data to a webhook instead of just using it as a notification for changes.
So if an external system were to implement their webhooks so that they send the entire object's data upon modification, the webhook handler could read that data and immediatly [issue an emission](#) instead of a publication.
However, because HEPTAconnect does not check for any authentication in webhooks, it highly recommended to implement a custom authentication in the webhook handler if you plan to import user input.

## Usage

To register a webhook handler, you must use the webhook service.
This service can be optained via the service discovery.
The webhook service's contract exposes a registration method.
You must specify the FQN of your webhook handler and you can optionally provide a payload for this webhook.
The webhook service will then generate a new unique url and save it along with your handler and your payload to the storage.
All these informations will then be returned as a webhook object.
The portal can then send the generated url to the external system for it to execute a request to it later.

Your webhook handler must implement the WebhookHandlerContract.
When an incoming web request matches your generated webhook url, the payload will be read from the storage and the corresponding webhook handler will be called.
The webhook handler receives the web request as a PSR-7 request object alongside a context object.
This context behaves similarly to the contexts in exploration, emission or reception and contains the payload that was used in the handler's registration.
The payload can be useful to (among other things) reliably determine the correlating object.
