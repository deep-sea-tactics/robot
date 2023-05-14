#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

mkdir ~/$1 -p

cp -r ~/Landstown-Robotics-Challenge/colmap-stdfs/ ~/$1
cp -r -/Landstown-Robotics-Challenge/screenshots/ -/$1/images/

if [ $2 -eq 32 ] ; then
	cp ~/colmap/pretrainedvocabtrees/vocab_tree_flickr100K_words32K.bin ~/$1
elif [ $2 -eq 256 ] ; then
	cp ~/colmap/pretrainedvocabtrees/vocab_tree_flickr100K_words256K.bin ~/$1
else
	echo "Invalid vocab tree size"
fi 

colmap automatic_reconstructor --workspace_path=$1 --image_path=$1/images/ --vocab_tree_path=$1/\*.bin --data_type=video --quality=medium --mesher=delaunay

meshlab $1/dense/meshed-delaunay.ply