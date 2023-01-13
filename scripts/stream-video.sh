#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

cd "$(dirname "$0")"

main() {
	if test "${CODESPACES+x}"; then
		../webrtc-streamer/webrtc-streamer -v file://workspaces/Landstown-Robotics-Challenge/videos/robert.mp4
	else
		echo "No-internet broadcasting not implemented yet"
	fi
}

main "$@"