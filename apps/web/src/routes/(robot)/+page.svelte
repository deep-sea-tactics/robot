<script lang="ts">
	import Controller from '$lib/components/handlers/Controller.svelte';
	import Keyboard from '$lib/components/handlers/Keyboard.svelte';
	import type { ControllerData } from 'robot/dist/controller';
	import { client } from '$lib/connections/robot';
	import { env } from '$env/dynamic/public';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import Simulation from '../simulation/Simulation.svelte';
	const isMock = env.PUBLIC_MOCK === 'true';
	let gamepad: Gamepad;
	let gamepadOutput: ControllerData;
	let keyboardOutput: ControllerData;
	$: output = gamepadOutput ?? keyboardOutput;
	$: if (output) client?.controllerData.mutate(output);
</script>

<Controller bind:gamepad bind:output={gamepadOutput} />
<Keyboard bind:output={keyboardOutput} />

<Splitpanes style="height: 100vh;">
	<Pane>
		{#if isMock}
			<Simulation />
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
					<!-- TODO add xbox controller -->
				</div></Pane
			>
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
