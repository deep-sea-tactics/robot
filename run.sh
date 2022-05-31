#!/bin/sh

(cd client; pnpm run dev) &
(cd server; pnpm run start)

fuser -k 5000/tcp # kill the svelte process
