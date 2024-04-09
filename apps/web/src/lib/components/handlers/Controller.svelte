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
		const UA = navigator.userAgent;
		if (!gamepad) return;
		if (UA.includes('Linux')) {
			output = {
				connected: gamepad.connected,
				id: gamepad.id,
				mainAxes: {
					x: gamepad.axes[0],
					y: gamepad.axes[1] * -1
				},
				secondaryAxes: {
					x: gamepad.axes[4],
					y: gamepad.axes[5] * -1
				},
				yaw: gamepad.axes[2],
				trigger: gamepad.buttons[0].pressed,
				buttons: {
					leftSmall: gamepad.buttons[4].pressed,
					rightSmall: gamepad.buttons[5].pressed,
					leftBig: gamepad.buttons[2].pressed,
					rightBig: gamepad.buttons[3].pressed, 
					bottomSmall: gamepad.buttons[11].pressed,
					bottomBig: gamepad.buttons[10].pressed
				}
			};
		} else if (UA.includes('Windows')) {
			//todo impl
		}
		requestAnimationFrame(getInput);
	}
</script>
