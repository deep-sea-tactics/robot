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
	local RELEASE_X86=https://github.com/mpromonet/webrtc-streamer/releases/download/v0.7.0/webrtc-streamer-v0.7.0-Linux-x86_64-Release.tar.gz
	local RELEASE_ARM64=https://github.com/mpromonet/webrtc-streamer/releases/download/v0.7.0/webrtc-streamer-v0.7.0-Linux-arm64-Release.tar.gz
	local RELEASE_ARM7=https://github.com/mpromonet/webrtc-streamer/releases/download/v0.7.0/webrtc-streamer-v0.7.0-Linux-armv7l-Release.tar.gz
	# local RELEASE_ARM6=https://github.com/mpromonet/webrtc-streamer/releases/download/v0.7.0/webrtc-streamer-v0.7.0-Linux-armv6l-Release.tar.gz

	rm -rf webrtc-streamer
	mkdir -p ../webrtc-streamer
	local ARCHITECTURE=
	ARCHITECTURE=$(uname -m)
	local RELEASE=

    if echo "$ARCHITECTURE" | grep -q 'x86_64'; then # x86
        RELEASE=$RELEASE_X86
    elif echo "$ARCHITECTURE" | grep -q 'aarch64\|arm64'; then # arm64
		RELEASE=$RELEASE_ARM64
	elif echo "$ARCHITECTURE" | grep -q 'armv7\|armhf'; then # armv7
		RELEASE=$RELEASE_ARM7
	fi

	wget $RELEASE -O ../webrtc-streamer/release.tar.gz
	tar -xvzf ../webrtc-streamer/release.tar.gz  --strip-components=1 --directory ../webrtc-streamer
}

main "$@"
