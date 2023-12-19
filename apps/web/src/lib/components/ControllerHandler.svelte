<script lang="ts">
	import { Canvas, Layer, type Render } from 'svelte-canvas';
	import Controller from './handlers/Controller.svelte';
	import Keyboard from './handlers/Keyboard.svelte';
	import type { ControllerData } from 'robot/dist/controller';
	import { client } from '$lib/connections/robot';

	let gamepad: Gamepad;

	let gamepadOutput: ControllerData;
	let keyboardOutput: ControllerData;

	$: output = gamepad ? gamepadOutput : keyboardOutput;
	$: if (output) client?.controllerData.mutate(output);

	const render: Render = ({ context, width, height }) => {
		if (!output) return;
		context.font = `${width / 30}px sans-serif`;
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillStyle = 'tomato';
		context.fillText(`${output.position.x.toFixed(3)}, ${output.position.y.toFixed(3)}`, width / 2, height / 2);
		/* in case you wanna use a square instead 
		context.fillRect(
			(width / 2) * (output.position.x + 1) - 5,
			(height / 2) * (output.position.y + 1) - 5,
			10,
			10
		);*/
		context.beginPath();
		context.arc(
			(width / 2) * (output.position.x + 1),
			(height / 2) * (output.position.y + 1),
			5,
			0,
			2 * Math.PI
		);
		context.fill();
		context.strokeStyle = 'tomato';
		context.beginPath();
		context.moveTo(width / 2, height / 2);
		context.lineTo((width / 2) * (output.position.x + 1), (height / 2) * (output.position.y + 1));
		context.stroke();
				
	};
</script>

<Controller bind:gamepad bind:output={gamepadOutput} />
<Keyboard bind:output={keyboardOutput} />

<Canvas autoplay>
	<Layer {render} />
</Canvas>
