<script lang="ts">
	import type { ControllerData } from 'robot/src/controller';
	import GamepadApi from './GamepadAPI.svelte';
	import { buttonAxis, deadzone } from './utils';

	export let output: ControllerData | undefined;
</script>

<GamepadApi
	bind:output
	idContains={'Logitech Gamepad'}
	gamepadToConfig={(gamepad) => ({
		connected: gamepad.connected,
		id: gamepad.id,
		movement: {
			x: gamepad.axes[0],
			z: gamepad.axes[1] * -1,
			y: buttonAxis(gamepad.buttons[12].pressed, gamepad.buttons[13].pressed)
		},
		rotation: {
			pitch: gamepad.axes[2],
			yaw: deadzone(gamepad.axes[3] * -1, [-0.4, 0.1])
		},
		tasks: {
			pinkSquare: gamepad.buttons[0].pressed,
			scanning: gamepad.buttons[1].pressed
		},
		camera: {
			y: buttonAxis(gamepad.buttons[5].pressed, gamepad.buttons[4].pressed)
		},
		arm: {
			openClose: (gamepad.axes[5] + 1) / 2 - (gamepad.axes[4] + 1) / 2,
			rotate: buttonAxis(gamepad.buttons[9].pressed, gamepad.buttons[8].pressed)
		}
	})}
/>
