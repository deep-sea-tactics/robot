<script lang="ts">
	import Controller from '$lib/components/handlers/Controller.svelte';
	import Keyboard from '$lib/components/handlers/Keyboard.svelte';
	import type { ControllerData } from 'robot/dist/controller';
	import { client } from '$lib/connections/robot';
	import Simulation from '$lib/components/simulation/Simulation.svelte';

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
			<Simulation />
		</div>
		
		
	</div>
	<div class="bottomBar">
		<div class="item">
			{#if output?.id.includes("0ce6")}
				<p>ps5 controller</p>
			{:else if output?.id.includes("09cc") || output?.id.includes("05c4")}
				<p>ps4 controller</p>
			{:else if output?.id === "keyboard"}
				<p>keyboard</p>
			{:else}
				<p>unknown controller ({output?.id})</p>
			{/if}
		</div>
		
		<div class="item">test</div>
	</div>
</div>

<style>
	.item {
		flex: 1;
	}

	.wrap {
		color: var(--text);
		overflow-y: hidden;
	}

	.grid {
		display: flex;
		min-height: 10vh;
		height: 80vh;
		display: flex;
	}
	.bottomBar {
		display: flex;
		height: 20vh;
		background: var(--bgDark);
	}
</style>
