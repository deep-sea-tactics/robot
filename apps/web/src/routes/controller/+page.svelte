<script lang="ts">
	import Logitech from '$lib/components/handlers/LogitechController.svelte';
	import Keyboard from '$lib/components/handlers/Keyboard.svelte';
	import type { ControllerData } from 'robot/dist/controller';

	let output: ControllerData;
	let keyboardOutput: ControllerData;
</script>

<svelte:head>
	<title>Controller Debugging</title>
</svelte:head>

<Logitech bind:output />
<Keyboard bind:output={keyboardOutput} />

<main>
	<pre>{JSON.stringify(output, null, 2)}</pre>
	<pre>{JSON.stringify(keyboardOutput, null, 2)}</pre>
</main>

<style>
	main {
		margin: 1rem;
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: calc(100% - 2rem);
		height: calc(100% - 2rem);
	}
</style>
