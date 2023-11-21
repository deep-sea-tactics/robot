FROM node:latest

# install ffmpeg, coturn
RUN apt-get update && apt-get install -y ffmpeg coturn

# install dependencies
RUN npm install -g pnpm
