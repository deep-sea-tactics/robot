<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';
	import { ArrowHelper } from 'three';
	import * as vector from 'vector'

	export let origin: vector.VectorLike;
	export let direction: vector.VectorLike;
	export let length: number;
	export let color: number;
</script>

{#if length > 0}
	<T
		is={ArrowHelper}
		args={[
			new THREE.Vector3(...vector.asTuple(vector.normalize(direction))),
			new THREE.Vector3(...vector.asTuple(origin)),
			length,
			color
		]}
	/>
{:else}
	<T
		is={ArrowHelper}
		args={[
			new THREE.Vector3(...vector.asTuple(vector.normalize(direction))),
			new THREE.Vector3(...vector.asTuple(vector.scale(origin)(-1))),
			length,
			color
		]}
	/>
{/if}
