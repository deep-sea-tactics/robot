<script lang="ts">
	import type { ControllerData } from 'robot/src/controller';
	import { VITE_MOCK } from '$env/static/public';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import Simulation from '../simulation/Simulation.svelte';
	import Arbitrary, { type Icon } from '$lib/controller/Arbitrary.svelte';
	import { onMount } from 'svelte';
	import TrpcConnection, {
		type TRPCClient,
		type WSClient
	} from '$lib/connections/TRPCConnection.svelte';
	import { rpiIp } from '$lib/connections/ip';

	const isMock = VITE_MOCK === 'true';
	let output: ControllerData;
	let client: TRPCClient;

	$: if (output) client?.controllerData.mutate(output);

	let temperature: number | undefined = undefined;

	let icons: Icon[] | undefined;
	let wsClient: WSClient | undefined;

	$: wsClientConnection = wsClient?.getConnection();
	$: wsClientState = wsClient?.getConnection().readyState;
	$: [wsClientColor, wsClientText] =
		wsClientState === wsClientConnection?.CLOSED
			? ['red', 'closed']
			: wsClientState === wsClientConnection?.CLOSING
				? ['stopping', 'closing']
				: wsClientState === wsClientConnection?.CONNECTING
					? ['starting', 'connecting']
					: ['green', 'connected'];

	onMount(() => {
		if (!client) throw new Error('No client found!');

		client.systemInformation.subscribe(undefined, {
			onData(data) {
				temperature = data.cpuTemperature;
			}
		});
	});
</script>

<TrpcConnection bind:client bind:wsClient />

<Arbitrary bind:output bind:icons />

<Splitpanes style="height: 100vh;">
	<Pane>
		{#if isMock}
			<Simulation bind:client />
		{:else}
		<!-- TODO: use cloud-url-resolver -->
			<div class="videoStreamWrap">
				<img
					src="http://{rpiIp ?? "127.0.0.1"}:8080/stream"
					alt="Video stream cannot be rendered. Perhaps no signal?"
					class="videoStream"
				/>
			</div>
		{/if}
	</Pane>
	<Pane size={20} minSize={15} maxSize={30}>
		<Splitpanes horizontal={true}>
			<Pane>
				<div class="pane">
					<img src="favicon.png" alt="Deep Sea Tactics" />
					<h2>Status</h2>
					<p>
						<span class="deviceText">
							<b>Device</b>:
							<span class={output?.connected ? 'green' : 'red'}>
								{output?.connected ? output.id : 'disconnected'}
							</span>
						</span>
						{#if icons}
							<div class="icons">
								{#each icons as icon}
									<div class="icon">
										<svelte:component this={icon} />
									</div>
								{/each}
							</div>
						{/if}
					</p>
					<p>
						<b>Mode</b>: <span class={isMock ? 'blue' : 'green'}>{isMock ? 'mock' : 'live'}</span>
					</p>
					<p><b>tRPC status</b>: <span class={wsClientColor}>{wsClientText}</span></p>
					{#if temperature}
						<p><b>Temperature</b>: {temperature}</p>
					{/if}
				</div>
			</Pane>
		</Splitpanes>
	</Pane>
</Splitpanes>

<style lang="scss">
	.videoStream {
		height: 100%;
	}

	.videoStreamWrap {
		background-color: black;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.green {
		color: green;
	}

	.stopping {
		color: coral;
	}

	.starting {
		color: greenyellow;
	}

	.red {
		color: red;
	}

	.blue {
		color: var(--accent);
	}

	.pane {
		padding: 10px;
		background: var(--background);
		height: 100%;
		color: var(--foreground);
		text-align: center;

		img {
			aspect-ratio: 1 / 1;
			width: 100%;
		}
	}

	div.icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.deviceText {
		vertical-align: middle;
	}

	.icons {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		vertical-align: middle;
		gap: 0.5rem;
	}
</style>
