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
    (cd ../native-camera; poetry show -v | grep virtualenv)
}

main "$@"
