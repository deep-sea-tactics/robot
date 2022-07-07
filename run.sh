#!/bin/sh

(cd client; npm run dev) &
(cd server; npm run dev)

fuser -k 4000/tcp # kill the svelte process
fuser -k 3000/tcp
fuser -k 5000/tcp
