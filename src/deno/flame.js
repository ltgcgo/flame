// Copyright (c) Lumière Élevé 2023.
// Copyright (c) Lightingale Flame Author(s) 2023.
// Licensed under GNU AGPL 3.0.

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
