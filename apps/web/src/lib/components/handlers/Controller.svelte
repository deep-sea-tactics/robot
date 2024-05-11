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

	function booleanToNumber(bool: boolean): 0 | 1 {
		return bool ? 1 : 0;
	}

	function getInput() {
		gamepad = navigator.getGamepads()[0];

		if (!gamepad) {
			console.warn("No controller connected")
			return
		};

		output = {
			connected: gamepad.connected,
			id: gamepad.id,
			movement: {
				x: gamepad.axes[0],
				z: gamepad.axes[1] * -1,
				y: booleanToNumber(gamepad.buttons[12].pressed)
					- booleanToNumber(gamepad.buttons[13].pressed)
			},
			rotation: {
				pitch: gamepad.axes[2],
				yaw: gamepad.axes[3] * -1,
			},
			tasks: {
				pinkSquare: gamepad.buttons[0].pressed,
				barrelRoll: gamepad.buttons[3].pressed,
				scanning: gamepad.buttons[1].pressed,
			},
			arm: {
				openClose: (-gamepad.axes[4] - 1) / 2 + (gamepad.axes[5] + 1) / 2,
			}
		};

		requestAnimationFrame(getInput);
	}
</script>
