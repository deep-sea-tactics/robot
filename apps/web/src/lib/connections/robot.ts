import { createTRPCProxyClient, createWSClient, wsLink } from '@trpc/client';
import type { RobotRouter } from "robot/src/server";
import { browser } from '$app/environment';

export const client = browser ? createTRPCProxyClient<RobotRouter>({
  links: [
    wsLink({
      client: createWSClient({
        url: `ws://localhost:9000`,
      }),
    }),
  ],
}) : null;
