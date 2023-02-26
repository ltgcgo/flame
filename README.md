# Lightingale Flame
A Function-as-a-service template more oriented for the Web. Stream-first, async-only.

Urged by [`templates@openfaas/template`](https://github.com/openfaas/templates/blob/master/template/).

## Supported runtimes
* Node.js 18+
* Deno

## Documentation
### JavaScript
For JavaScript and the likes, each package only need to export a default handler.
#### Handler
```javascript
handler(Request req, FlameDetails details): Promise<Response>
```
#### FlameDetails
```javascript
class FlameDetails {
	Object remote: {
		addr: String,
		port: Number
	}
}
```
#### FlameWebSocket
```javascript
class FlameWebSocket {
	socket: WebSocketServer,
	response: Response
}
```
#### globalThis.Flame
```javascript
Flame {
	variant: String,
	getEnv(String key): String,
	upgradeWebSocket(Request req): FlameWebSocket
}
```