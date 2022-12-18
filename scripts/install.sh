#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

cd "$(dirname "$0")"

main() {
	go install github.com/yoheimuta/protolint/cmd/protolint@latest # install protolint
	npm i -g nodemon # install nodemon
	yarn # install yarn dependencies
	(cd ../native-camera; pip install -r requirements.txt) # install poetry dependencies in native-camera
	(cd ../landstown-robotics-types; yarn build) # build typings
}

main "$@"
