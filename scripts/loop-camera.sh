#!/usr/bin/env bash

# this doesn't work on gitpod / github codespaces yet.

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

cd "$(dirname "$0")"

main() {
	sudo ffmpeg -stream_loop -1 -re -i ../videos/robert.mp4 -map 0:v -f v4l2 /dev/video0
}

main "$@"
