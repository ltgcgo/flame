# Lightingale Flame
A Function-as-a-service template more oriented for the Web. Stream-first, async-only.

Urged by [`templates@openfaas`](https://github.com/openfaas/templates/blob/master/template/).

## Supported runtimes
* Node.js 18+
* Deno
* Cloudflare Workers _(as bridge)_

## Documentation
### JavaScript
For JavaScript and the likes, each package only need to export a default handler.
#### Handler
```language=javascript
handler(Request request, FlameDetails details): Promise<Response>
```
#### FlameDetails
```language=javascript
class FlameDetails {
	FlameIp ip: {
		addr: String,
		port: Number
	}
}
```
#### FlameWebSocket
```language=javascript
class FlameWebSocket {
	socket: WebSocketServer,
	response: Response
}
```
#### globalThis.Flame
```language=javascript
Flame {
	platformVariant: String,
	getEnv(String key): String,
	upgradeWebSocket(Request request): FlameWebSocket
}
```