// Copyright (c) Lumière Élevé 2023.
// Copyright (c) Lightingale Flame Author(s) 2023.
// Licensed under GNU AGPL 3.0.

"use strict";

import {Flame} from "./flame.js";
import http from "node:http";
import {wrappedResponse} from "./responder/index.js";

globalThis.self = globalThis.self || globalThis;
self.Flame = Flame;

let listenPort = parseInt(Flame.getEnv("LISTEN_PORT", "3000"));

let server = http.createServer(async function (requester, responder) {
	// This section was directly copied from Mint.
	let clientIp = requester.headers["x-real-ip"] || requester.headers["x-forwarded-for"] || requester.socket.remoteAddress;
	if (clientIp.indexOf("::ffff:") == 0) {
		clientIp = clientIp.slice(clientIp.lastIndexOf("::ffff:") + 7);
	};
	let readStreamController;
	let bodyStream = new ReadableStream({
		type: "bytes",
		start: (controller) => {
			readStreamController = controller;
		},
		cancel: (reason) => {},
		autoAllocateChunkSize: 65536
	});
	let reqOpt = {
		"method": requester.method,
		"headers": requester.headers
	};
	let bodyUsed = ["GET", "HEAD"].indexOf(reqOpt.method) == -1;
	requester.on("data", (chunk) => {
		readStreamController.enqueue(chunk);
	}).on("end", () => {
		readStreamController.close();
	});
	if (bodyUsed) {
		reqOpt.body = bodyStream;
		reqOpt.duplex = "half";
	};
	let request = new Request(`${requester.headers["x-forwarded-proto"] || "http"}://${requester.headers.host}${requester.url}`, reqOpt);
	let response = await wrappedResponse(request, {
		remote: {
			addr: clientIp,
			port: requester.socket.remotePort
		}
	});
	responder.statusCode = response?.status || 200;
	if (response?.statusText) {
		responder.statusMessage = response.statusText;
	};
	response?.headers?.forEach((v, k) => {
		responder.setHeader(k, v);
	});
	responder.flushHeaders();
	let repBodyStream = response.body.getReader(),
	repBodyFlowing = true;
	while (repBodyFlowing) {
		await repBodyStream.read().then(({done, value}) => {
			if (done) {
				responder.end();
				repBodyFlowing = false;
			} else {
				responder.write(value);
			};
		});
	};
});
server.listen(listenPort, "127.0.0.1", () => {
	console.info(`Listening on http://localhost:${listenPort}/`);
});
