#!/bin/sh

npm i -g pnpm
(cd client; sudo rm -rf ./node_modules; pnpm install)
(cd server; sudo rm -rf ./node_modules; pnpm install)
