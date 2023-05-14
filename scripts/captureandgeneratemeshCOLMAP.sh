#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

mkdir /home/underwaterrobotics/$1/ -p

mkdir /home/underwaterrobotics/$1/images/ -p

#cp -r /home/underwaterroboticsLandstown-Robotics-Challenge/screenshots/ -/$1/images/

if [ $2 -eq 32 ] ; then
	cp /home/underwaterrobotics/colmap/pretrainedvocabtrees/vocab_tree_flickr100K_words32K.bin /home/underwaterrobotics/$1
elif [ $2 -eq 256 ] ; then
	cp /home/underwaterrobotics/colmap/pretrainedvocabtrees/vocab_tree_flickr100K_words256K.bin /home/underwaterrobotics/$1
else
	echo "Invalid vocab tree size"
fi 

colmap automatic_reconstructor --workspace_path=/home/underwaterrobotics/$1/ --image_path=/home/underwaterrobotics/$1/images/ --vocab_tree_path='/home/underwaterrobotics/'$1'/vocab_tree_flickr100K_words'$2'K.bin' --data_type=video --quality=medium --mesher=delaunay

meshlab /home/underwaterrobotics/$1/dense/meshed-delaunay.ply