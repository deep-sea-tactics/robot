#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

cd "$(dirname "$0")"
cd ../webrtc-streamer

main() {
	if test "${DEV+x}"; then
		./webrtc-streamer -v file://workspaces/Landstown-Robotics-Challenge/videos/robert.mov
	else
		./webrtc-streamer -v v4l2:///dev/video0
	fi
}

main "$@"
