<script lang="ts" context="module">
	export type TRPCClient = CreateTRPCProxyClient<RobotRouter> | undefined;
	export type WSClient = ReturnType<typeof createWSClient>;
</script>

<script lang="ts">
	import {
		createTRPCProxyClient,
		createWSClient,
		wsLink,
		type CreateTRPCProxyClient
	} from '@trpc/client';
	import type { RobotRouter } from 'robot/src/server';
	import { transform } from 'cloud-url-resolver';
	import { onMount } from 'svelte';
	import { VITE_RPI_IP } from '$env/static/public';

	export const rpiIp = VITE_RPI_IP && VITE_RPI_IP.length > 1 ? VITE_RPI_IP : undefined;

	const ipAddr = rpiIp
		? transform(9000, 'ws', {
				origin: `http://${rpiIp}`
			})
		: transform(9000, 'ws');

	export let client: CreateTRPCProxyClient<RobotRouter> | undefined = undefined;
	export let wsClient: WSClient | undefined = undefined;

	onMount(() => {
		if (rpiIp) {
			console.log(`Connecting with RPI IP ${rpiIp} and resolved IP ${ipAddr}.`);
		} else {
			console.log(`Connecting with resolved IP ${ipAddr}`);
		}

		wsClient = createWSClient({
			url: rpiIp
				? transform(9000, 'ws', {
						origin: `http://${rpiIp}`
					})
				: transform(9000, 'ws')
		});

		wsClient.getConnection().addEventListener('close', () => (wsClient = wsClient));
		wsClient.getConnection().addEventListener('error', () => (wsClient = wsClient));
		wsClient.getConnection().addEventListener('open', () => (wsClient = wsClient));

		client = createTRPCProxyClient<RobotRouter>({
			links: [
				wsLink({
					client: wsClient
				})
			]
		});

		return () => wsClient?.close();
	});
</script>
