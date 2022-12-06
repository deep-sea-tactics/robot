#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

cd "$(dirname "$0")"

main() {
	curl -sSL https://install.python-poetry.org | python3 - # install poetry
	npm i -g nodemon # install nodemon
	yarn # install yarn dependencies
  (cd ../native-camera; poetry install) # install poetry dependencies in native-camera
	(cd landstown-robotics-types; yarn build) # build typings
}

main "$@"
