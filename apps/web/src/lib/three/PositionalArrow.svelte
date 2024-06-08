<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';
	import { ArrowHelper } from 'three';
	import * as vector from 'vector'

	export let to: vector.VectorLike;
	export let from: vector.VectorLike;
	export let color: number;

	$: direction = vector.normalize(vector.subtract(to)(from));
</script>

<T
	is={ArrowHelper}
	args={[
		new THREE.Vector3(...vector.asTuple(direction)),
		new THREE.Vector3(...vector.asTuple(from)),
		vector.magnitude(vector.subtract(to)(from)),
		color
	]}
/>
