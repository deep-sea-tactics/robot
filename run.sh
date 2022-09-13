#!/bin/sh

(cd client; yarn dev) &
(cd server; yarn dev)

fuser -k 4000/tcp # kill the svelte process
fuser -k 3000/tcp
fuser -k 5000/tcp
