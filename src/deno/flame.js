"use strict";

let Flame = {
	variant: "Deno",
	getEnv: (key, fallbackValue) => {
		return Deno.env.get(key) || fallbackValue;
	},
	upgradeWebSocket: (req) => {
		return Deno.upgradeWebSocket(req);
	}
};

export {
	Flame
};
