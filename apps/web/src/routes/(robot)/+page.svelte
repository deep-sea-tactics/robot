<script lang="ts">
	import type { ControllerData } from 'robot/dist/controller';
	import { env } from '$env/dynamic/public';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import Simulation from '../simulation/Simulation.svelte';
	import Arbitrary from '$lib/components/controller/Arbitrary.svelte';
	import { onMount } from 'svelte';
	import TrpcConnection, { type TRPCClient } from '$lib/connections/TRPCConnection.svelte';

	const isMock = env.VITE_MOCK === 'true';
	let output: ControllerData;
	let client: TRPCClient;

	$: if (output) client?.controllerData.mutate(output);

	let temperature: number | undefined = undefined;

	onMount(() => {
		if (!client) throw new Error('No client found!');

		client.systemInformation.subscribe(undefined, {
			onData(data) {
				temperature = data.cpuTemperature;
			}
		})
	})
</script>

<TrpcConnection bind:client />

<Arbitrary bind:output />

<Splitpanes style="height: 100vh;">
	<Pane>
		{#if isMock}
			<Simulation bind:client />
		{:else}
			<img
				src="http://127.0.0.1:8080/stream"
				alt="Video stream cannot be rendered. Perhaps no signal?"
				class="videoStream"
			/>
		{/if}
	</Pane>
	<Pane size={20} minSize={15} maxSize={30}>
		<Splitpanes horizontal={true}>
			<Pane>
				<div class="darkPane">
					<h2>Status</h2>
					<p>
						Controller: <span class={output?.connected ? 'green' : 'red'}
							>{output?.connected ? 'connected' : 'disconnected'}</span
						>
					</p>
					<p>Input Device: {output?.id}</p>
					<p>Mode: <span class={isMock ? 'blue' : 'green'}>{isMock ? 'mock' : 'live'}</span></p>
					<div class="controllers">
						{#if output?.id.includes('0ce6')}
							<img src="/controller_ps5.png" alt="ps5 controller" />
						{:else if output?.id.includes('09cc') || output?.id.includes('05c4')}
							<img src="/controller_ps4.png" alt="ps4 controller" />
						{:else if output?.id === 'keyboard'}
							<img src="/connect_controller.gif" alt="connect controller" />
							<p />
						{:else}
							<img src="/controller_generic.png" alt="ps4 controller" />
						{/if}
					</div>
				</div>
			</Pane>
			<Pane>
				<div class="darkPane">
					<p>Temperature: {temperature}</p>
				</div>
			</Pane>
		</Splitpanes>
	</Pane>
</Splitpanes>

<style>
	.green {
		color: green;
	}

	.red {
		color: red;
	}

	.blue {
		color: skyblue;
	}

	.darkPane {
		padding: 10px;
		background: var(--bgDark);
		height: 100%;
		color: var(--text);
	}

	.controllers img {
		width: 80%;
		height: fit-content;
	}
</style>
