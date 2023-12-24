<script lang="ts">
	import { Canvas, Layer, type Render } from 'svelte-canvas';
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

	// TODO move these bad biddies to library
	const renderStick: (stick: 'leftStick' | 'rightStick') => Render =
		(stick) =>
		({ context, width, height }) => {
			if (!output) return;
			const x = output.stickAxes[stick].x;
			const y = output.stickAxes[stick].y;

			context.font = `1rem sans-serif`;
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.fillStyle = 'tomato';
			context.fillText(`${x.toFixed(3)}, ${y.toFixed(3)}`, width / 2, height / 2);
			/* in case you wanna use a square instead 
		context.fillRect(
			(width / 2) * (x + 1) - 5,
			(height / 2) * (y + 1) - 5,
			10,
			10
		);*/
			context.beginPath();
			context.arc((width / 2) * (x + 1), (height / 2) * (-y + 1), 5, 0, 2 * Math.PI);
			context.fill();
			context.strokeStyle = 'tomato';
			context.beginPath();
			context.moveTo(width / 2, height / 2);
			context.lineTo((width / 2) * (x + 1), (height / 2) * (-y + 1));
			context.stroke();
		};
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
			<Canvas autoplay>
				<Layer render={renderStick('leftStick')} />
			</Canvas>
		</div>
		<div class="item">
			<Canvas autoplay>
				<Layer render={renderStick('rightStick')} />
			</Canvas>
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
