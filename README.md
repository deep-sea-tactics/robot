# robot

Source for the main Deep Sea Tactics ROV.

This is a [PNPM](https://pnpm.io/) & [Nx](https://nx.dev/) monorepo.

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

- `/apps/robot`: robot code (for driving motors)How runs on PI.
- `/apps/video`: isolated app for running [µStreamer](https://github.com/pikvm/ustreamer), runs on PI.
- `/apps/web`: UI (webserver), runs on land laptop.

`robot` hosts a TRPC server that `web` connects to for bi-directional communication. `video` runs µStreamer.

### Mocking

Same components as above, but:

- `robot:mock` communicates with a [tRPC](https://trpc.io/) on the client that now hosts a _simulation_ with [threlte](https://threlte.xyz/) that drives the "motors."

## Setting up Physical Robot

This assumes the running system is a Raspberry PI. For more information, go to [deep-sea-tactics/rpi-setup](https://github.com/deep-sea-tactics/rpi-setup)

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

## Q&A

### Why TypeScript & Rust instead of Python?

TypeScript is a language that can make good UI, but it isn't Rust (I'm not subjecting the high school programming team all to Rust), and it still has reasonable hardware control. It is also incredibly compatible with cloud IDEs (given the web nature).

#### Why Rust?

I could not resist the temptations.

### Why PNPM?

I like saving storage locally.

### Why tRPC?

It's like [socket.io](https://socket.io/) but with type-safety embedded, not as an afterthought.

### Why Nx?

Initially, this repository used [Turbo](https://turbo.build/), but it didn't support ARM.

### Why µStreamer?

Incredible out-of-the-box support for Raspberry PIs.

### Why the random PNPM patch?

https://github.com/dimforge/rapier.js/pull/264
