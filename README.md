# Landstown Underwater Robotics Challenge

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://github.com/LeoDog896/Landstown-Robotics-Challenge)

This is the repository for the LHS robotics challenge.

To run, open VSCode (or gitpod, or github codespaces) and use `CTRL + SHIFT + B` -- select the `Development` build task.

## Components

### Relay

This is the packet relay.

It makes two `socket.io` hooks for the UI and the robot.

### UI

A user-friendly UI for managing the robot and receiving data from the controller.

### Robot (robot-py)

This is the robot controller. It hooks into the server and sends the processed data to its servos and other mechanisms, as well as sending processed monitoring data such as cameras and sensors back to the server.

## Contributing

Run `./install.sh` to install dependencies using yarn and build the project's Typings

Use `./run.sh`, or use `CTRL + SHIFT + B` and select `Development` to test out the server and the UI.

The project is made in TypeScript and it is encouraged to follow the IDE's reccomendations.

### Configuring python virtual enviornment

Press F1, select interpeter, enter interpreter path, select the one with blue `Poetry` on the right, and select (enter).

OR, if the interpeter doesn't show: `poetry show -v | grep virtualenv`
