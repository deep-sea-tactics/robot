# robot

Source for the main Deep Sea Tactics ROV.

This is a PNPM & Turbo monorepo.

## Task Pipelines

There are 2 different task categories:

### Development

These tasks do not depend on `build`

- `robot:mock`: mocking version of the robot code to be run on docker/podman
- `dev`: runs all frontend (land computer) tasks in development mode.

### Production

Some of these tasks may depend on `build`:

- `build`: builds *everything*, and is used when the robot is being moved to real production
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

Same components as above, but:
- instead of a PI, this all runs in `docker-compose`.
- Web has a `/simulation` subroute, where:
    - The `video` feed comes from here.
    - `robot` communicates with a tRPC server hosted on `/simulation` that drives the "motors"
