# robot

Source for the main Deep Sea Tactics ROV.

This is a PNPM & Turbo monorepo.

## Task Pipelines

> Note: To run any of these tasks, do `pnpm run <task>`.

There are two different task categories:

### Development

These tasks do not depend on `build`

- `robot:mock`: mocking version of the robot code to be run on docker / podman
- `dev`: runs all frontend (land computer) tasks in development mode.

### Production

Some of these tasks may depend on `build`:

- `build`: builds _everything_, and is used when the robot is being moved to real production
- `start`: runs all frontend (land computer) tasks
- `robot`: runs all non-mocked robot tasks (for Raspberry PI)

## Architecture

`/packages/*` serve as general utilities.

### Non-mocking:

- `/apps/robot`: robot code (for driving motors), runs on PI
- `/apps/video`: isolated app for running [µStreamer](https://github.com/pikvm/ustreamer), runs on PI
- `/apps/web`: UI (webserver), runs on land laptop

`robot` hosts a TRPC server that `web` connects to for bi-directional communication. `video` runs µStreamer and depends on a `coturn` server for TURN and STUN signaling servers.

### Mocking

Same components as above, but:

- `robot` communicates with a [tRPC](https://trpc.io/) on the client that now hosts a *simulation* that drives the "motors"
