// Copyright (c) Lumière Élevé 2023.
// Copyright (c) Lightingale Flame Author(s) 2023.
// Licensed under GNU AGPL 3.0.

"use strict";

export default async function (req, rem) {
	//throw(new Error("An error"));
	if (req.headers.get("Upgrade")?.toLowerCase() == "websocket") {
		let {socket, response} = Flame.upgradeWebSocket(req);
		socket.addEventListener("open", function (ev) {
			console.info(`WS opened.`);
		});
		socket.addEventListener("message", function (ev) {
			socket.send(ev.data);
			console.info(`WS echoed ${ev.data.length} bytes.`);
		});
		socket.addEventListener("close", function (ev) {
			console.info(`WS closed.`);
		});
		return response;
	} else {
		return new Response(`Hello world, from ${Flame.variant}!\nYou are from [${rem.remote.addr}]:${rem.remote.port}.`, {
			status: 200,
			headers: {
				"Content-Type": "text/plain"
			}
		});
	};
};
