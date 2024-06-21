<script lang="ts">
	import type { ControllerData } from 'robot/src/controller';
	import GamepadApi from './GamepadAPI.svelte';
	import { buttonAxis, deadzone } from './utils';

	export let output: ControllerData | undefined;
</script>

<GamepadApi
	bind:output
	idContains={'Logitech Gamepad'}
	gamepadToConfig={({
		'unix-firefox': (gamepad) => ({
			connected: gamepad.connected,
			id: gamepad.id,
			movement: {
				x: deadzone(gamepad.axes[0] * -1, [-0.03, 0.03]),
				z: deadzone(gamepad.axes[1] * -1, [-0.03, 0.03]),
				y: buttonAxis(gamepad.buttons[12].pressed, gamepad.buttons[13].pressed)
			},
			rotation: {
				yaw: buttonAxis(gamepad.buttons[14].pressed, gamepad.buttons[15].pressed),
				pitch: deadzone(gamepad.axes[3] * -1, [-0.03, 0.03])
			},
			tasks: {
				pinkSquare: gamepad.buttons[3].pressed,
				scanning: gamepad.buttons[1].pressed
			},
			camera: {
				y: buttonAxis(gamepad.buttons[5].pressed, gamepad.buttons[4].pressed)
			},
			arm: {
				openClose: (gamepad.axes[5] + 1) / 2 - (gamepad.axes[4] + 1) / 2,
				rotate: buttonAxis(gamepad.buttons[4].pressed, gamepad.buttons[5].pressed)
			}
		})
	})}
/>
