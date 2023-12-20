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
		context.font = `1rem sans-serif`;
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillStyle = 'tomato';
		context.fillText(`${output.view}`, width / 2, height / 2);
		
		
				
	};
</script>

<Controller bind:gamepad bind:output={gamepadOutput} />
<Keyboard bind:output={keyboardOutput} />

<Canvas autoplay>
	<Layer {render} />
</Canvas>
