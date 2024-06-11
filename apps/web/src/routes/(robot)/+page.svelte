<script lang="ts">
	import type { ControllerData } from 'robot/dist/controller';
	import { env } from '$env/dynamic/public';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import Simulation from '../simulation/Simulation.svelte';
	import Arbitrary, { type Icon } from '$lib/components/controller/Arbitrary.svelte';
	import { onMount } from 'svelte';
	import TrpcConnection, { type TRPCClient } from '$lib/connections/TRPCConnection.svelte';

	const isMock = env.VITE_MOCK === 'true';
	let output: ControllerData;
	let client: TRPCClient;

	$: if (output) client?.controllerData.mutate(output);

	let temperature: number | undefined = undefined;

	let icons: Icon[] | undefined;

	onMount(() => {
		if (!client) throw new Error('No client found!');

		client.systemInformation.subscribe(undefined, {
			onData(data) {
				temperature = data.cpuTemperature;
			}
		});
	});
</script>

<TrpcConnection bind:client />

<Arbitrary bind:output bind:icons />

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
						<span class="deviceText">
							Device:
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
					<p>Mode: <span class={isMock ? 'blue' : 'green'}>{isMock ? 'mock' : 'live'}</span></p>
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
