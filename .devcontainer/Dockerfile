FROM mcr.microsoft.com/devcontainers/typescript-node:18

RUN apt-get update && apt-get install -y coturn libgl1-mesa-dev xvfb python3 python3-pip

RUN pip3 install -r ./requirements.txt
