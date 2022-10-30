# Landstown Underwater Robotics Challenge

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://github.com/LeoDog896/Landstown-Robotics-Challenge)

This is the repository for the LHS robotics challenge.

To run, open VSCode (or gitpod!) and press `CTRL + SHIFT + B`

## Components

There are multiple components that make up
this project.

### Server

This is the main controller.

It hosts the web service and the robot hooks into it. It also handles data processing and external devices such as controllers.

### Client

This is the website. It acts as a user-friendly UI for managing the robot and viewing data sent out by the server.

### Robot (robot-py)

This is the robot controller. It hooks into the server and sends the processed data to its servos and other mechanisms, as well as sending processed monitoring data such as cameras and sensors back to the server.

## Specifications

A position is a set of two numbers (x, y) between 0 - 100.

If a position is (50, 50) then the position is in the middle and the robot would stay still

The client, server, and robot use socket.io to communicate with eachother instead of raw TCP packets

## Contributing

Use `./run.sh`, or use `CTRL + SHIFT + B` to test out the server and the client.

The project is made in TypeScript and it is encouraged to follow the IDE's reccomendations.

If you have any issues with connecting the controller on a linux machine, use `fix_controller.sh` to fix the controller.
