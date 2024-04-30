<script lang="ts">
	import { onMount } from 'svelte';
	import type { ControllerData } from 'robot/dist/controller';

	export let gamepad: Gamepad | null = null;
	export let output: ControllerData;

	let outputTest: any;

	$: console.log(gamepad)

	

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
		
		if (!gamepad) {
			console.warn("No controller connected")
			return
		};
		outputTest  = gamepad.buttons[12].pressed
			output = {
				connected: gamepad.connected,
				id: gamepad.id,
				mainAxes: {
					x: gamepad.axes[0],
					y: gamepad.axes[1] * -1
				},
				secondaryAxes: {
					x: gamepad.axes[2],
					y: gamepad.axes[3] * -1
				},
				plusButtonCombo: {
					up: gamepad.buttons[12].pressed,
					right: gamepad.buttons[15].pressed,
					down: gamepad.buttons[13].pressed,
					left: gamepad.buttons[14].pressed
				},
				yaw: 0,
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

		requestAnimationFrame(getInput);
	}
</script>

<div class="controllerDisplay">
	<pre>{JSON.stringify(outputTest, null, 4)}</pre>

</div>

<style lang="scss">
	.controllerDisplay {
		position: absolute;
		top: 0px;
		left: 0px;
		margin: 0.25rem;
		background: rgba(0, 0, 0, 0.75);
		color: white;
		padding: 1rem;
	}
	
	
</style>
