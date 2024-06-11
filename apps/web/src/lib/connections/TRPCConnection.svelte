<script lang="ts" context="module">
	export type TRPCClient = CreateTRPCProxyClient<RobotRouter> | undefined;
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
	import { env } from '$env/dynamic/public';

	export const rpiIp = env.VITE_RPI_IP && env.VITE_RPI_IP.length > 1 ? env.VITE_RPI_IP : undefined;

	const ipAddr = rpiIp
		? transform(9000, 'ws', {
				origin: `http://${rpiIp}`
			})
		: transform(9000, 'ws');

	export let client: CreateTRPCProxyClient<RobotRouter> | undefined = undefined;

	onMount(() => {
		if (rpiIp) {
			console.log(`Connecting with RPI IP ${rpiIp} and resolved IP ${ipAddr}.`);
		} else {
			console.log(`Connecting with resolved IP ${ipAddr}`);
		}

		const wsClient = createWSClient({
			url: rpiIp
				? transform(9000, 'ws', {
						origin: `http://${rpiIp}`
					})
				: transform(9000, 'ws')
		});

		client = createTRPCProxyClient<RobotRouter>({
			links: [
				wsLink({
					client: wsClient
				})
			]
		});

		return () => wsClient.close();
	});
</script>
