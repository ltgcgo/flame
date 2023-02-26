// Copyright (c) Lumière Élevé 2023.
// Copyright (c) Lightingale Flame Author(s) 2023.
// Licensed under GNU AGPL 3.0.

"use strict";

import {Flame} from "../deno/flame.js";
import {serve} from "std/http/server.ts";
import {wrappedResponse} from "./responder/index.js";

self.Flame = Flame;

let serveOptions = {};
if (Flame.getEnv("LISTEN_PORT")) {
	serveOptions.port = parseInt(Flame.getEnv("LISTEN_PORT", "3000"));
};

console.info(`Listening on http://localhost:${serveOptions.port}/`);
for await (const tcpServer of Deno.listen(serveOptions)) {
	// Connection established
	(async function (tcpServer) {
		for await (const ev of Deno.serveHttp(tcpServer)) {
			ev.respondWith(await wrappedResponse(ev.request, {
				remote: {
					addr: tcpServer.remoteAddr.hostname,
					ip: tcpServer.remoteAddr.port || 0
				}
			}));
		};
	})(tcpServer);
};
