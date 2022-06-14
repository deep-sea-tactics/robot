#!/bin/sh

npm i -g pnpm
pnpm i -g node-pre-gyp # necessary for mocking
(cd client; pnpm ci)
(cd server; pnpm ci)
(cd mock; pnpm ci)
