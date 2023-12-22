<script lang="ts">
	import { onMount } from 'svelte';
	import type { ControllerData } from 'robot/dist/controller';

	export let gamepad: Gamepad | null = null;
	export let output: ControllerData;

	onMount(() => {
		function onGamepadConnected(e: GamepadEvent) {
			gamepad = navigator.getGamepads()[e.gamepad.index];
			requestAnimationFrame(getInput);
		}

		function onGamepadDisconnected(e: GamepadEvent) {
			gamepad = null;
		}

		window.addEventListener('gamepadconnected', onGamepadConnected);
		window.addEventListener('gamepaddisconnected', onGamepadDisconnected);

		return () => {
			window.removeEventListener('gamepadconnected', onGamepadConnected);
			window.removeEventListener('gamepaddisconnected', onGamepadDisconnected);
		};
	});

	function getInput() {
		gamepad = navigator.getGamepads()[0];
		if (!gamepad) return;
		output = {
			connected: gamepad.connected,
			axes: {
				leftStick: {
					x: gamepad.axes[0],
					y: gamepad.axes[1] * -1 // invert y axis (up is positive)
				},
				rightStick: {
					x: gamepad.axes[2],
					y: gamepad.axes[3] * -1 // invert y axis (up is positive)
				},
			},
			dPad: {
					up: gamepad.buttons[12].pressed,
					down: gamepad.buttons[13].pressed,
			},
			bumbers: {
				left: gamepad.buttons[4].pressed,
				right: gamepad.buttons[5].pressed,
			},
			shapeButtons: {
				up: gamepad.buttons[3].pressed,
				down: gamepad.buttons[0].pressed,
				left: gamepad.buttons[2].pressed,
				right: gamepad.buttons[1].pressed,
			},
			rightThree: gamepad.buttons[11].pressed
		};

		requestAnimationFrame(getInput);
	}
</script>
