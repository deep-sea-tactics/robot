import { createTRPCProxyClient, createWSClient, wsLink } from '@trpc/client';
import type { RobotRouter } from 'robot/src/server';
import { browser } from '$app/environment';

// TODO: make protocol either "http" or "ws"
function transform(port: number, protocol = "https"): string {
  if (browser) {
    const url = location.origin.substring("https://xxxx".length);

    if (!url) throw Error("GITPOD_WORKSPACE_URL not defined")

    const transformedURL = `${protocol}://${port}${url}`;

    return transformedURL;
  }

  return `${protocol}://localhost:${port}`;
}

// TODO: transform this into a component
export const client = browser
	? createTRPCProxyClient<RobotRouter>({
			links: [
				wsLink({
					client: createWSClient({
						url: transform(9000, "ws")
					})
				})
			]
	  })
	: null;
