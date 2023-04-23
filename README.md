# Landstown Underwater Robotics Challenge

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://github.com/LeoDog896/Landstown-Robotics-Challenge)

This is the repository for the LHS robotics challenge.

To run, open VSCode (or gitpod, or github codespaces) and use `CTRL + SHIFT + B` -- select the `Development` build task.

## Running

There are a few lifetime scripts:

| Script                        | Description                                                                   |
| ----------------------------- | ----------------------------------------------------------------------------- |
| `./scripts/install.sh`        | Installs all dependencies for the project.                                    |
| `./scripts/dev.sh`            | Runs the development servers.                                                 |
| `./scripts/build.sh`          | Builds the UI and the server.                                                 |
| `./scripts/run.sh`            | Runs the server (requires build).                                             |
| `./scripts/stream-install.sh` | Installs the webrtc streamer ([mediamtx](https://github.com/aler9/mediamtx)). |
| `./scripts/stream-run.sh`     | Runs mediamtx.                                                                |
| `./scripts/robot.sh`          | Runs the robot controller (intended to be run on PI).                         |
| `./scripts/kill.sh`           | Kills all running servers (ui, relay).                                        |

Streamer scripts and the robot script are intended to be run on the PI.

All other scripts are intended to be run on the UI machine.

## Components

### Relay

This is the packet relay.

It makes two `socket.io` hooks for the UI and the robot.

### UI

A user-friendly UI for managing the robot and receiving data from the controller.

### Robot (robot-py)

This is the robot controller. It hooks into the server and sends the processed data to its servos and other mechanisms, as well as sending processed monitoring data such as cameras and sensors back to the server.

## Configuration

Copy the `turnserver.config` to /etc/turnserver.conf`

Copy `config.yml` to the proper config in `webrtc-streamer` after running `scripts/install-streamer.sh`

## Health

Run `yarn outdated` to check for unhealthy dependencies.

## Keep this repository private

https://discord.gg/HxaB6CK8Kv
