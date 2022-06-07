#!/bin/sh

(cd client; pnpm run dev) &
(cd server; pnpm run dev)

fuser -k 5000/tcp # kill the svelte process
