<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { World } from '@threlte/rapier';
</script>

<Canvas>
	<World>
		<Scene />
	</World>
</Canvas>
