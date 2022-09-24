# Current

## Controller Broadcast (keeping)

The `/server` module handles getting native controller input from the host operating system and relays them to conneted nodes.

## Timer (discuss)

The timer library inside `frontend` helps keep time for tasks. This feature wasn't used last year, but may be repurposed for the tasks in frontend.

## Controller Debug Tooling (keeping)

Controller views in both the main frontend page and a client-side visualizer for the camera model can be used for reliable testing that the controller is being passed to everywhere. This serves as essentially a status checkup for manual operations.

## Camera Switcher (modification needed)

In the frontend, you can switch between given camera endpoints. This is currently hardcoded, but with the proposal of a camera management system, this will be automated.

# TODO

## Controller Mixins

When adding OpenCV and other camera processing, the client should be allowed to send their own controller data to counteract the current one being used on the controller. The ONLY exception to this is `trigger`, which must be held as a safeguard in case anything goes wrong. If the trigger isn't held, nothing happens. The safeguard can be turned off via a socket.io parameter (for a controller mock system for development).

This also means simple controller-locking tasks such as Go Forward can be easily automated.

## Task List

You can apply tasks (& task descriptions) enabling certain CV (Computer Vision) operations. **The Task List needs to be compiled ASAP once the documents come out.**

## CV overlay

CV (or Computer Vision) overlay is an overlay on top of *any* generic video stream. Using a optimized build of OpenCV for the web, computer vision can happen in real time directly on top of the UI-running computer. By making this generic to any video stream, we can change the way our cameras are connected without needing to rechange the cores of our CV system.

## Camera Controller

The `server` module should have some `/camera` endpoints that allows camera management (the data itself is transferred with WebRTC), the `client` module will have extra debug tools for mocking a camera and using your own camera, and a newly proposed `/look` will be run on the raspberry PI that broadcasts connected cameras to the server `/camera` endpoints.

## Camera Testing Utilities

These Camera Testing Utilities can have CV tasks applied to them for CV testing in a standalone enviornment.

### Camera Self

Camera self (in progress) sends your own webcam for quick object testing. It connets with the Camera Controller proposed system.

### Camera Mock

Camera Mock allows you to display a standalone image or a looping video to the camera sender