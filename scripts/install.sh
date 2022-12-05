#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

npm i -g nodemon

yarn

(cd native-camera; poetry install)

(cd landstown-robotics-types; yarn build)
