# robot

Source for the main Deep Sea Tactics ROV.

This is a PNPM & Nx monorepo.

## Task Pipelines

> [!NOTE]
> To run any of these tasks, do `pnpm run <task>`. The `robot` task must be run as root if [µStreamer](https://github.com/pikvm/ustreamer) is not installed.

There are two different task categories:

### Development

These tasks do not depend on `build`

- `robot:mock`: mocking version of the robot code to be run on docker / podman.
- `dev`: runs all frontend (land computer) tasks in development mode.

### Production

Some of these tasks may depend on `build`:

- `build`: builds _everything_, and is used when the robot is being moved to real production.
- `start`: runs all frontend (land computer) tasks.
- `robot`: runs all non-mocked robot tasks (for Raspberry PI).

## Architecture

`/packages/*` serve as general utilities.

### Non-mocking:

- `/apps/robot`: robot code (for driving motors), runs on PI.
- `/apps/video`: isolated app for running [µStreamer](https://github.com/pikvm/ustreamer), runs on PI.
- `/apps/web`: UI (webserver), runs on land laptop.

`robot` hosts a TRPC server that `web` connects to for bi-directional communication. `video` runs µStreamer.

### Mocking

Same components as above, but:

- `robot:mock` communicates with a [tRPC](https://trpc.io/) on the client that now hosts a _simulation_ that drives the "motors".

## Setting up Physical Robot

This assumes the running system is a Raspberry PI.

```sh
source <(curl -s https://raw.githubusercontent.com/deep-sea-tactics/rpi-setup/main/rov.sh)
```

Instead of using `:mock`, use `dev` and `robot` directly.

Configure `.env` to point to the proper RPI IP address.

### Troubleshooting

Remove the PNPM global content addressable store if PNPM is causing issues:

```sh
rm -rf $(pnpm store path)
```
