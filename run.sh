#!/bin/sh

(cd client; npm run dev) &
(cd server; npm run dev)

fuser -k 5000/tcp # kill the svelte process
