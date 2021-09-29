#!/bin/sh

(cd client; pnpm run dev) &
(cd server; pnpm run start)