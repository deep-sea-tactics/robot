#!/bin/sh

(cd client; npm run dev) &
(cd server; npm run dev)

fuser -k 4000/tcp # kill the svelte process
