<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';
	import { ArrowHelper } from 'three';
	import * as vector from 'vector'

	export let to: vector.VectorLike;
	export let from: vector.VectorLike;
	export let length: number;
	export let color: number;
</script>

{#if length > 0}
	<T
		is={ArrowHelper}
		args={[
			new THREE.Vector3(...vector.asTuple(vector.subtract(to)(from))),
			new THREE.Vector3(...vector.asTuple(from)),
			length,
			color
		]}
	/>
{:else}
	<T
		is={ArrowHelper}
		args={[
			new THREE.Vector3(...vector.asTuple(vector.scale(vector.subtract(to)(from))(-1))),
			new THREE.Vector3(...vector.asTuple(from)),
			length,
			color
		]}
	/>
{/if}
