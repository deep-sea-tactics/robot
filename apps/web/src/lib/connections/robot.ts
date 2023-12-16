import { createTRPCProxyClient, createWSClient, wsLink } from '@trpc/client';
import type { RobotRouter } from "robot/src/server";

const wsClient = createWSClient({
  url: `ws://localhost:9000`,
});

export const client = createTRPCProxyClient<RobotRouter>({
  links: [
    wsLink({
      client: wsClient,
    }),
  ],
});
