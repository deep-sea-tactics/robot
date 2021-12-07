#!/bin/sh

(cd client; pnpm run dev) &
(cd server; pnpm run start) &
(python3 2021_CODE/python/V4/Final\ Code/RoverServo.py)

fuser -k 5000/tcp # kill the svelte process