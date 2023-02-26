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

serve(async function (request, connInfo) {
	return await wrappedResponse(request, {
		remote: {
			addr: connInfo.remoteAddr.hostname,
			port: connInfo.remoteAddr.port || 0
		}
	});
}, serveOptions);
