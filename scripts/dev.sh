#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

cd "$(dirname "$0")"

main() {
	(cd ../landstown-robotics-types; yarn build)

	# kill all subshells and processes on exit
	trap "kill 0" SIGINT
	# start commands in subshells so all their spawn DIE when we exit
	( cd ../ui; yarn dev ) &
	( cd ../relay; yarn dev ) &
	wait
}

main "$@"