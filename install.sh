#!/bin/sh

npm i -g pnpm
(cd client; pnpm install)
(cd server; pnpm install)