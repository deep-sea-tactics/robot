<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { World } from '@threlte/rapier';

	let isRovInCollider: boolean
</script>

<Canvas>
	<World>
		<Scene bind:isRovInCollider />
	</World>
</Canvas>

<p>{isRovInCollider}</p>
<style>
	p{
		position: fixed;
		top: 0;
		left: 0;
	}
</style>