<script lang="ts">
	import Controller from '$lib/components/handlers/Controller.svelte';
	import Keyboard from '$lib/components/handlers/Keyboard.svelte';
	import type { ControllerData } from 'robot/dist/controller';
	import { client } from '$lib/connections/robot';
	import Simulation from '$lib/components/simulation/Simulation.svelte';
	import { env } from '$env/dynamic/public';

	const isMock = env.PUBLIC_MOCK === 'true';
	let gamepad: Gamepad;
	let gamepadOutput: ControllerData;
	let keyboardOutput: ControllerData;
	$: output = gamepadOutput ?? keyboardOutput;
	$: if (output) client?.controllerData.mutate(output);
</script>

<Controller bind:gamepad bind:output={gamepadOutput} />
<Keyboard bind:output={keyboardOutput} />

<div class="wrap">
	<div class="grid">
		<div class="item">
			{#if isMock}
				<Simulation />
			{:else}
				<!-- NOTE: we cannot use img:enhanced here -->
				<img src="http://127.0.0.1:8080/stream" alt="Video stream cannot be rendered. Perhaps no signal?" class="videoStream" />
			{/if}
		</div>
	</div>
	<div class="bottomBar">
		<div class="item controllers">
			<!-- TODO add xbox controller -->
			{#if output?.id.includes('0ce6')}
				<img src="/controller_ps5.png" alt="ps5 controller" />
			{:else if output?.id.includes('09cc') || output?.id.includes('05c4')}
				<img src="/controller_ps4.png" alt="ps4 controller" />
			{:else if output?.id === 'keyboard'}
				<img src="/connect_controller.gif" alt="connect controller" />
				<p />
			{:else}
				<p>unknown controller ({output?.id})</p>
				<img src="/controller_generic.png" alt="ps4 controller" />
			{/if}
		</div>

		<div class="item">
			<div class="commandCenter">
				<h2>Status</h2>
				<p>Controller: <span class={output?.connected ? "green" : "red"}>{output?.connected ? "connected" : "disconnected"}</span></p>
				<p>Input Device: {output?.id}</p>
				<p>Mode: <span class={isMock ? "blue" : "green"}>{isMock ? "mock" : "live"}</span></p>
			</div>
		</div>
	</div>
</div>

<style>
	.item {
		flex: 1;
		display: flex;
		justify-content: space-evenly;
	}
	.wrap {
		color: var(--text);
		overflow-y: hidden;
		display: flex;
	}

	.grid {
		display: flex;
		min-width: 10vw;
		width: 80vw;
	}
	.bottomBar {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 20vw;
		background: var(--bgDark);
	}

	.controllers {
		display: flex;
		justify-content: center;
	}

	.controllers img {
		max-width: 100%;
		padding: 1.5rem;
		height: fit-content;
	}

	.videoStream {
		width: auto;
		height: 100%;
	}

	.green {
		color: green;
	}

	.red {
		color: red;
	}

	.blue {
		color: skyblue;
	}

	.commandCenter {
		margin: 0 10px;
	}
</style>
