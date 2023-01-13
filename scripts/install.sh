#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

cd "$(dirname "$0")"

main() {
	sudo npm i -g nodemon # install nodemon
	yarn # install yarn dependencies
	(cd ../native-camera; pip install -r requirements.txt) # install poetry dependencies in native-camera
	(cd ../landstown-robotics-types; yarn build) # build typings
	./install-streamer.sh # installs webrtc-streamer
}

main "$@"
