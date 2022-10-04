# Current

## Controller Broadcast (keeping)

The `/server` module handles getting native controller input from the host operating system and relays them to conneted nodes. Using `node-hid`, it can read and parse the data directly from the controller for minimum latency.

## Timer (discuss)

The timer library inside `frontend` helps keep time for tasks. This feature wasn't used last year, but may be repurposed for the tasks in frontend.

## Controller Debug Tooling (keeping)

Controller views are available in:

- The main frontend page (control UI)
- Client-Side visualizer for the camera model that can be used for reliable testing

The visualizer serves as a status checkup that controller input is working perfectly (and looks sick).

## Camera Switcher (modification needed)

In the frontend, you can switch between given camera endpoints.
This is currently hardcoded, but with the proposal of a camera management system, this will be automated.

## Yarn Monorepo (keeping)

A yarn monorepo allows us to use shared libraries and have a universal type package which can be used for the proposed global Socket.IO typnigs

## Controller Mixins

When adding OpenCV and other camera processing, the client should be allowed to send their own controller data to counteract the current one being used on the controller. The ONLY exception to this is `trigger`, which must be held as a safeguard in case anything goes wrong. If the trigger isn't held, nothing happens. The safeguard can be turned off via a socket.io parameter (for a controller mock system for development).

This also means simple controller-locking tasks such as Go Forward can be easily automated.

## Global SocketIO typings

With Yarn set up and ready, we can share types and scripts between different projects.

# TODO

## Task List

You can apply tasks (& task descriptions) enabling certain CV (Computer Vision) operations. **The Task List needs to be compiled ASAP once the documents come out.**
The task list will be available at the top of the UI with a simple search bar, and clicking on any of the tasks will make it active. Tasks can be stopped mid-way with a prmopt to confirm.

## CV overlay

CV (or Computer Vision) overlay is an overlay on top of _any_ generic video stream.
Using a optimized build of OpenCV for the web, computer vision can happen in real time directly on top of the UI-running computer.
By making this generic to any video stream, we can change the way our cameras are connected, use our own cameras, or even just a regular video without much effort.

## Camera Controller

Using socket.io, there will be a subset of packets for managing cameras and negociating WebRTC connections. This will be used for the camera switcher.

## Camera Testing Utilities

These Camera Testing Utilities can have CV tasks applied to them for CV testing in a standalone enviornment.

### Camera Self

Camera self (in progress) sends your own webcam to the camera controller for quick object testing.

### Camera Mock

Camera Mock allows you to display a standalone image or a looping video to the camera controller
