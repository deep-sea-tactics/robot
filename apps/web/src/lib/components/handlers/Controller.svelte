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
				stickAxes: {
					leftStick: {
						x: gamepad.axes[0],
						y: gamepad.axes[1] * -1 // invert y axis (up is positive)
					},
					rightStick: {
						x: gamepad.axes[3],
						y: gamepad.axes[4] * -1 // invert y axis (up is positive)
					}
				},
				stickButtons: {
					leftStick: gamepad.buttons[11].pressed,
					rightStick: gamepad.buttons[12].pressed
				},
				bumbers: {
					left: gamepad.buttons[4].pressed,
					right: gamepad.buttons[5].pressed
				},
				triggers: {
					left: gamepad.buttons[6].pressed,
					right: gamepad.buttons[7].pressed
				},
				shapeButtons: {
					down: gamepad.buttons[0].pressed,
					right: gamepad.buttons[1].pressed,
					up: gamepad.buttons[2].pressed,
					left: gamepad.buttons[3].pressed
				}
			};
		} else if (UA.includes('Windows')) {
			output = {
				id: gamepad.id,
				connected: gamepad.connected,
				stickAxes: {
					leftStick: {
						x: gamepad.axes[0],
						y: gamepad.axes[1] * -1 // invert y axis (up is positive)
					},
					rightStick: {
						x: gamepad.axes[2],
						y: gamepad.axes[3] * -1 // invert y axis (up is positive)
					}
				},
				stickButtons: {
					leftStick: gamepad.buttons[10].pressed,
					rightStick: gamepad.buttons[11].pressed
				},
				bumbers: {
					left: gamepad.buttons[4].pressed,
					right: gamepad.buttons[5].pressed
				},
				triggers: {
					left: gamepad.buttons[6].pressed,
					right: gamepad.buttons[7].pressed
				},
				shapeButtons: {
					down: gamepad.buttons[0].pressed,
					right: gamepad.buttons[1].pressed,
					up: gamepad.buttons[3].pressed,
					left: gamepad.buttons[2].pressed
				}
			};
		}
		requestAnimationFrame(getInput);
	}
</script>
