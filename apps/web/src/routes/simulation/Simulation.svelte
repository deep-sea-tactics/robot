<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { World } from '@threlte/rapier';
	import type { TRPCClient } from '$lib/connections/TRPCConnection.svelte';

	export let client: TRPCClient;
</script>

<Canvas>
	<World>
		<Scene bind:client />
	</World>
</Canvas>
