"use strict";

let Flame = {
	variant: "Node",
	getEnv: (key, fallbackValue) => {
		return process.env[key] || fallbackValue;
	},
	upgradeWebSocket: (req) => {
		// TODO
		return;
	}
};

export {
	Flame
};
