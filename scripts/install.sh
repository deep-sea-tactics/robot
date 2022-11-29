#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

yarn

pip3 install -r .devcontainer/requirements.txt

(cd landstown-robotics-types; yarn build)
