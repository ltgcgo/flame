// Copyright (c) Lumière Élevé 2023.
// Copyright (c) Lightingale Flame Author(s) 2023.
// Licensed under GNU AGPL 3.0.

"use strict";

import {WebSocketServer as WebSocketService} from "ws";

let WebSocketServer = class {
	#attached;
	#url;
	#closed = false;
	#dataQueue = [];
	#events = {
		open: [],
		message: [],
		error: [],
		close: []
	};
	addEventListener(type, handler) {
		if (this.#attached) {
			if (type != "open") {
				this.#attached.addEventListener(type, handler);
			} else {
				handler(new Event("open"));
			};
		} else {
			this.#events[type].push(handler);
		};
	};
	get binaryType () {
		return this.#attached?.binaryType || "";
	};
	get bufferedAmount () {
		return this.#attached?.bufferedAmount || 0;
	};
	get extensions () {
		return this.#attached?.extensions || "";
	};
	get readyState () {
		return this.#attached?.readyState || 0;
	};
	get url () {
		return this.#attached?.url || this.#url;
	};
	attach (wsService) {
		if (this.#closed) {
			return false;
		};
		if (this.#attached) {
			throw(new Error("Already attached a WebSocket object"));
			return false;
		};
		this.#attached = wsService;
		let upThis = this;
		switch (wsService.readyState) {
			case 0:
			case 1: {
				for (let type in this.#events) {
					this.#events[type].forEach((e) => {
						wsService.addEventListener(type, e);
					});
				};
				let openEvent = new Event("open");
				this.#events.open.forEach((e) => {
					e(openEvent);
				});
				break;
			};
			case 2:
			case 3: {
				upThis.dispatchEvent(new Event("close"));
				break;
			};
		};
	};
	close (...args) {
		this.#closed = true;
		return this.#attached?.close(...args);
	};
	send (data) {
		if (this.#attached) {
			this.#attached.send(data);
		} else {
			this.#dataQueue.push(data);
		};
	};
	constructor (request) {
		this.#url = request.url.replace("http", "ws");
		this.addEventListener("open", (ev) => {
			// Send everything in the queue
			while (this.#dataQueue.length > 0) {
				this.#attached.send(this.#dataQueue.shift());
			};
		});
	};
};

let Flame = {
	variant: "Node",
	getEnv: (key, fallbackValue) => {
		return process.env[key] || fallbackValue;
	},
	upgradeWebSocket: (req) => {
		let wsUpgrader = new WebSocketService({noServer: true});
		let wsServer = new WebSocketServer(req);
		wsUpgrader.handleUpgrade(req.raw.requester, req.raw.socket, req.raw.head, function (ws) {
			wsServer.attach(ws);
		});
		return {
			socket: wsServer,
			response: new Response(null, {
				status: 200
			})
		};
	}
};

export {
	Flame
};
