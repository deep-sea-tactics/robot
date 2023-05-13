#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

cd "$(dirname "$(readlink -f "$0")")"

main() {
	echo "Building Typings..."
	(cd ../landstown-robotics-types; yarn build)
	echo "Finished building typings!"

	(cd ../ui; yarn build)

	echo "Done!"
}

main "$@"
