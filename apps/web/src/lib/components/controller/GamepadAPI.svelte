<script lang="ts">
	import { onMount } from 'svelte';
	import type { ControllerData } from 'robot/dist/controller';

	export let gamepad: Gamepad | null = null;
	export let output: ControllerData | null = null;
	export let idContains: string;
	export let gamepadToConfig: (gamepad: Gamepad) => ControllerData;

	let animationFrame: number | undefined;

	onMount(() => {
		animationFrame = requestAnimationFrame(getInput);

		return () => {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
			}
		};
	});

	function getInput() {
		if (navigator.getGamepads().length < 1) {
			console.warn('No controller connected');
			output = null;
			animationFrame = requestAnimationFrame(getInput);
			return;
		}

		gamepad =
			navigator
				.getGamepads()
				.find((gamepadIter) => gamepadIter?.id.toLowerCase().includes(idContains.toLowerCase())) ??
			null;

		if (!gamepad) {
			output = null;
			animationFrame = requestAnimationFrame(getInput);
			return;
		}

		output = gamepadToConfig(gamepad);

		animationFrame = requestAnimationFrame(getInput);
	}
</script>
