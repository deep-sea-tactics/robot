<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { World } from '@threlte/rapier';

	let acceleration: any;
</script>

<Canvas>
	<World>
		<Scene bind:acceleration />
	</World>
</Canvas>

<p>{acceleration}</p>

<style>
	p {
		position: fixed;
		top: 0;
		left: 0;
	}
</style>
