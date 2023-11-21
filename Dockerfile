FROM node:21-alpine3.17

# install ffmpeg, coturn
RUN apk add --no-cache ffmpeg coturn

# install dependencies
RUN npm install -g pnpm
