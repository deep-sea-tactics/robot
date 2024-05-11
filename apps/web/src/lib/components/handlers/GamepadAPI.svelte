<script lang="ts">
	import { onMount } from 'svelte';
	import type { ControllerData } from 'robot/dist/controller';

	export let gamepad: Gamepad | null = null;
	export let output: ControllerData | null = null;
	export let idContains: string;
	export let gamepadToConfig: (gamepad: Gamepad) => ControllerData;

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

		if (!gamepad) {
			console.warn("No controller connected")
			output = null;
			return;
		};

		if (!gamepad.id.toLowerCase().includes(idContains.toLowerCase())) {
			output = null;
			return;
		}

		output = gamepadToConfig(gamepad);

		requestAnimationFrame(getInput);
	}
</script>
