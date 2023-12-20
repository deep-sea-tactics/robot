<script lang="ts">
	import { Canvas, Layer, type Render } from 'svelte-canvas';
	import Controller from './handlers/Controller.svelte';
	import Keyboard from './handlers/Keyboard.svelte';
	import type { ControllerData  } from 'robot/dist/controller';
	import { client } from '$lib/connections/robot';

	export let stick: string;
	let gamepad: Gamepad;

	let gamepadOutput: ControllerData;
	let keyboardOutput: ControllerData;

	$: output = gamepad ? gamepadOutput : keyboardOutput;
	$: if (output) client?.controllerData.mutate(output);

	const render: Render = ({ context, width, height }) => {
		if (!output) return;
		const x = output.axes[stick].x;
		const y = output.axes[stick].y;

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
		context.arc(
			(width / 2) * (x + 1),
			(height / 2) * (-y + 1),
			5,
			0,
			2 * Math.PI
		);
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

<Canvas autoplay>
	<Layer {render} />
</Canvas>
