<script lang="ts">
	import Controller from '$lib/components/handlers/Controller.svelte';
	import Keyboard from '$lib/components/handlers/Keyboard.svelte';
	import type { ControllerData } from 'robot/dist/controller';
	import { client } from '$lib/connections/robot';
	import Simulation from '$lib/components/simulation/Simulation.svelte';

	const isMock = process.env.MOCK === 'true';
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
				<!-- todo add video feed -->
				<p>video goes here</p>
			{/if}
		</div>
		
		
	</div>
	<div class="bottomBar">
		<div class="item controllers">
			<!-- TODO add xbox controller -->
			{#if output?.id.includes("0ce6")}
				<img src="/controller_ps5.png" alt="ps5 controller" />
			{:else if output?.id.includes("09cc") || output?.id.includes("05c4")}
				<img src="/controller_ps4.png" alt="ps4 controller" />
			{:else if output?.id === "keyboard"}
				<img src="/connect_controller.gif" alt="connect controller" />
				<p></p>
			{:else}
				<p>unknown controller ({output?.id})</p>
				<img src="/controller_generic.png" alt="ps4 controller" />
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

	.controllers {
		display: flex;
		justify-content: center;
	}

	.controllers img {
		height: 100%;
		padding: 1.5rem;
		width: auto;
}
</style>
