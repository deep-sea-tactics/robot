import { createTRPCProxyClient, createWSClient, wsLink } from '@trpc/client';
import type { RobotRouter } from 'robot/src/server';
import { browser } from '$app/environment';

type Protocol = 'http' | 'ws';

function transform(port: number, protocol: Protocol = 'http'): string {
	const resolvedProtocol = (location.protocol === 'https:' ? (protocol === 'http' ? 'https' : 'wss') : protocol);

	if (browser) {
		if (location.origin.includes('gitpod.io')) {
			const url = location.origin.substring('https://xxxx'.length);

			if (!url) throw Error('workspace url not defined');

			const transformedURL = `${resolvedProtocol}://${port}${url}`;

			return transformedURL;
		}

		// TODO: codespace support
	}

	return `${resolvedProtocol}://localhost:${port}`;
}

// TODO: transform this into a component
export const client = browser
	? createTRPCProxyClient<RobotRouter>({
			links: [
				wsLink({
					client: createWSClient({
						url: transform(9000, 'ws')
					})
				})
			]
	  })
	: null;
