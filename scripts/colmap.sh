#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

mkdir ~/$1/ -p

mkdir ~/$1/images/ -p

if [ $2 -eq 32 ] ; then
        cp ~/colmap/pretrainedvocabtrees/vocab_tree_flickr100K_words32K.bin ~/$1
    elif [ $2 -eq 256 ] ; then
        cp ~/colmap/pretrainedvocabtrees/vocab_tree_flickr100K_words256K.bin ~/$1
    else
        echo "Invalid vocab tree size" 
fi

colmap automatic_reconstructor --single_camera=1 --workspace_path=~/$1/ --image_path=~$1/images/ --vocab_tree_path='~/'$1'/vocab_tree_flickr100K_words'$2'K.bin' --data_type=video --quality=medium --mesher=delaunay

meshlab ~/$1/dense/meshed-delaunay.ply
