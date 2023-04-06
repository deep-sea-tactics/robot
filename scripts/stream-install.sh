#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

cd "$(dirname "$0")"

# https://stackoverflow.com/questions/45125516/possible-values-for-uname-m/45125525#45125525
main() {
	local RELEASE=https://github.com/aler9/mediamtx/releases/download/v0.22.0/mediamtx_v0.22.0_linux_arm64v8.tar.gz
	rm -rf webrtc-streamer
	mkdir -p ../webrtc-streamer
	wget $RELEASE -O ../webrtc-streamer/release.tar.gz
	tar -xvf ../webrtc-streamer/release.tar.gz --directory ../webrtc-streamer
}

main "$@"
