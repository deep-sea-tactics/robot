FROM mcr.microsoft.com/devcontainers/typescript-node:18

RUN apt-get update && apt-get install -y coturn libgl1-mesa-dev xvfb python3 python3-pip &&\
	REQUIREMENTS="/workspaces/Landstown-Robotics-Challenge/.devcontainer/requirements.txt"
	pip3 install -r $REQUIREMENTS