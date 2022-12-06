#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

pip install pycodestyle flake8-tabs

npm i -g nodemon

yarn

(cd native-camera; poetry install)

(cd landstown-robotics-types; yarn build)
