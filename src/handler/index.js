// Copyright (c) Lumière Élevé 2023.
// Copyright (c) Lightingale Flame Author(s) 2023.
// Licensed under GNU AGPL 3.0.

"use strict";

export default async function (req, rem) {
	//throw(new Error("An error"));
	return new Response(`Hello world, from ${Flame.variant}!\nYou are from [${rem.remote.addr}]:${rem.remote.port}.`, {
		status: 200
	});
};
