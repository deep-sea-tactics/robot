<script lang="ts">
	import type { ControllerData } from 'robot/src/controller';
	import GamepadApi from './GamepadAPI.svelte';
	import { buttonAxis, deadzone } from './utils';

	export let output: ControllerData | undefined;
</script>

<GamepadApi
	bind:output
	idContains={'Logitech Extreme'}
	gamepadToConfig={(gamepad) => ({
		connected: gamepad.connected,
		id: gamepad.id,
		movement: {
			x: gamepad.axes[0],
			z: gamepad.axes[1] * -1,
			y: buttonAxis(gamepad.buttons[5].pressed, gamepad.buttons[3].pressed)
		},
		rotation: {
			pitch: buttonAxis(gamepad.buttons[4].pressed, gamepad.buttons[2].pressed),
			yaw: deadzone(gamepad.axes[2], [-0.4, 0.1])
		},
		tasks: {
			pinkSquare: gamepad.buttons[9].pressed,
			scanning: gamepad.buttons[11].pressed
		},
		camera: {
			y: gamepad.axes[5] * -1
		},
		arm: {
			openClose: buttonAxis(gamepad.buttons[0].pressed, gamepad.buttons[1].pressed),
			rotate: gamepad.axes[3] * -1
		}
	})}
/>
