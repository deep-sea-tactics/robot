#!/bin/sh

(cd client; pnpm run build) &
(cd server; pnpm run start)

fuser -k 5000/tcp # kill the svelte process