// Copyright (c) Lumière Élevé 2023.
// Copyright (c) Lightingale Flame Author(s) 2023.
// Licensed under GNU AGPL 3.0.

"use strict";

import handler from "../handler/index.js";

let applyDefaultHeaders = function (headers, values) {
	for (let key in values) {
		if (!headers.has(key)) {
			headers.set(key, values[key]);
		};
	};
};

let wrappedResponse = async function (request, details) {
	let response;
	try {
		response = await handler(request, details);
	} catch (err) {
		// Emit caught error
		response = new Response(`Uncaught ${err.stack}`, {
			status: 500
		});
	};
	applyDefaultHeaders(response.headers, {
		"Content-Type": "text/plain",
		"Server": "Lightingale Flame"
	});
	return response;
};

export {
	wrappedResponse
};
