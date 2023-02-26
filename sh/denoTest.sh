#!/bin/bash
export LISTEN_PORT=8005
deno run --allow-net --allow-env src/deno/index.js
exit
