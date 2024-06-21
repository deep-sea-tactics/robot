<script lang="ts">
	import type { ControllerData } from 'robot/src/controller';
	import GamepadApi from './GamepadAPI.svelte';
	import { buttonAxis, deadzone } from './utils';

	export let output: ControllerData | undefined;
</script>

<GamepadApi
	bind:output
	idContains={'Logitech Dual'}
	gamepadToConfig={({
		'unix-firefox': (gamepad) => ({
			connected: gamepad.connected,
			id: gamepad.id,
			movement: {
				x: gamepad.axes[0] * -1,
				z: gamepad.axes[1] * -1,
				y: gamepad.axes[3] * -1
			},
			rotation: {
				pitch: buttonAxis(gamepad.buttons[0].pressed, gamepad.buttons[3].pressed),
				yaw: deadzone(gamepad.axes[2], [-0.11, 0.11])
			},
			tasks: {
				pinkSquare: gamepad.buttons[1].pressed,
				scanning: gamepad.buttons[2].pressed
			},
			camera: {
				y: buttonAxis(gamepad.buttons[4].pressed, gamepad.buttons[5].pressed)
			},
			arm: {
				openClose: buttonAxis(gamepad.buttons[6].pressed, gamepad.buttons[7].pressed),
				rotate: buttonAxis(gamepad.buttons[9].pressed, gamepad.buttons[8].pressed)
			}
		})
	})}
/>
