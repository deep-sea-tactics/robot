import { createTRPCProxyClient, createWSClient, wsLink } from '@trpc/client';
import type { RobotRouter } from 'robot/src/server';
import { browser } from '$app/environment';
import { transform } from 'cloud-url-resolver';

export const rpiIp =
	import.meta.env.VITE_RPI_IP?.length > 1 ? import.meta.env.VITE_RPI_IP : undefined;

const ipAddr = rpiIp
	? transform(9000, 'ws', {
			origin: `http://${rpiIp}`
		})
	: transform(9000, 'ws');

if (rpiIp) {
	console.log(`Connecting with RPI IP ${rpiIp} and resolved IP ${ipAddr}.`);
} else {
	console.log(`Connecting with resolved IP ${ipAddr}`);
}
// TODO: transform this into a component
export const client = browser
	? createTRPCProxyClient<RobotRouter>({
			links: [
				wsLink({
					client: createWSClient({
						url: rpiIp
							? transform(9000, 'ws', {
									origin: `http://${rpiIp}`
								})
							: transform(9000, 'ws')
					})
				})
			]
		})
	: null;
