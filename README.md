# robot

Source for the main Deep Sea Tactics ROV.

This is a PNPM & Turbo monorepo.

## Mocking

Run `docker-compose up` to begin the robot emulation. If you are working on the docker container itself and are having cache issues, do `docker compose rm`.

## Task Pipelines

> Note: To run any of these tasks, do `pnpm run <task>`.

There are different task categories:

### Development

These tasks do not depend on `build`

- `robot:mock`: mocking version of the robot code to be run on docker.
- `dev`: runs all frontend (land computer) tasks in development mode.

### Production

Some of these tasks may depend on `build`:

- `build`: builds _everything_, and is used when the robot is being moved to real production
- `start`: runs all frontend (land computer) tasks
- `robot`: runs all non-mocked robot tasks (for raspberry PI)

## Architecture

`/packages/*` serve as general utilities.

### Non-mocking:

- `/apps/robot`: robot code (for driving moters), runs on PI
- `/apps/video`: isolated app for running mediamtx, runs on PI
- `/apps/web`: UI (web server), runs on land laptop

`robot` hosts a TRPC server that `web` connects to for bi-directional communication. `video` runs mediamtx, and depends on a `coturn` server for TURN and STUN signaling servers.

### Mocking

Same as above, with the following changes:

- instead of a PI, this all runs in `docker-compose`
- `/apps/web` is disregarded
- `/apps/delta` serves as the playground
  - The robot connects to this to send motor code
  - `/apps/video` uses a stream from here instead of the raspberry PI camera
- `/apps/e2e` orchestrates tests

