# Deep Sea Tactics Source

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://github.com/LeoDog896/Landstown-Robotics-Challenge)

This is the repository for the LHS Robotics Challenge.

To run, open VSCode (or Gitpod, or GitHub Codespaces) and use `CTRL + SHIFT + B` -- select the `Development` build task.

## Running

There are a few utility scripts for project maintenance:

| Script                        | Description                                                        |
| ----------------------------- | ------------------------------------------------------------------ |
| `./scripts/install.sh`        | Installs all dependencies for the project.                         |
| `./scripts/dev.sh`            | Runs the development server.                                       |
| `./scripts/build.sh`          | Builds the UI.                                                     |
| `./scripts/run.sh`            | Runs the server (requires build).                                  |
| `./scripts/stream-install.sh` | Installs the [mediamtx](https://github.com/aler9/mediamtx) server. |
| `./scripts/stream-run.sh`     | Runs mediamtx.                                                     |
| `./scripts/robot.sh`          | Runs the robot controller (intended to be run on PI).              |
| `./scripts/kill.sh`           | Kills the running UI server.                                       |

Streamer scripts and the robot script are intended to be run on the PI.

All other scripts are intended to be run on the UI machine.

## Components

### UI

A user-friendly UI for managing the robot and receiving data from the controller.

### Robot (robot-py)

This is the robot controller. It hooks into the server and sends the processed data to its servos and other mechanisms, as well as sending processed monitoring data such as cameras and sensors back to the server.

## Configuration

Prerequisites:

- [coturn](https://github.com/coturn/coturn) - install via your package manager

```sh
# configure coturn
cp turnserver.config /etc/turnserver.conf
# install mediamtx
./scripts/stream-install.sh
# configure mediamtx
cp config.yml mediamtx/config.yml
```

## Health

Run `pnpm outdated` to check for unhealthy dependencies.

`pnpm up --latest` updates all dependencies, but may break things.

## Discord Server

https://discord.gg/HxaB6CK8Kv
