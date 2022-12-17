FROM gitpod/workspace-full

RUN sudo apt-get update \
    && sudo apt-get install -y coturn libgl1-mesa-dev kmod xvfb ffmpeg \
		&& sudo rm -rf /var/lib/apt/lists/*
