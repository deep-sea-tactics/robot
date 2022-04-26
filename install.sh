#!/bin/sh

npm i -g pnpm
pnpm i -g node-pre-gyp
(cd client; sudo rm -rf ./node_modules; pnpm install)
(cd server; sudo rm -rf ./node_modules; pnpm install)
