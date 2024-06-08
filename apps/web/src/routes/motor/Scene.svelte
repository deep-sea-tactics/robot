<script lang="ts">
	import { T } from '@threlte/core';
	import ROV from './ROV.svelte'
	import { OrbitControls, Grid, Stars, Gizmo } from '@threlte/extras';
	import { getThruster, type MotorMovement } from 'robot/src/thrusters';
	import { ArrowHelper } from 'three';
	import * as vector from 'vector';
	import * as THREE from 'three';

	export let motors: MotorMovement[];
	export let desiredDirection: vector.Vector;
	export let actualDirection: vector.Vector;
</script>

<Stars />

<!--
	center of mass where
	x: 0.13 mm
	y: -11.773 mm
	z: -142.615 mm
 -->
<ROV position={[0.13 / 1000, 11.173 / 1000, 142.615 / 1000]} opacity={0.5} />

<T.AxesHelper
  args={[0.6]}
  renderOrder={1}
/>
{#key motors}
	{#each motors as motor}
		{@const thruster = getThruster(motor.type)}
		{@const direction = new THREE.Vector3(...vector.asTuple(thruster.thrustDirection))}
		{@const directionFlipped = new THREE.Vector3(-direction.x, -direction.y, -direction.z)}
		{@const position = new THREE.Vector3(...vector.asTuple(thruster.position))}
		{#if motor.speed > 0}
			<T
				is={ArrowHelper}
				args={[
					direction,
					position,
					motor.speed * 0.2,
					0x00ff00
				]}
			/>
		{:else}
			<T
				is={ArrowHelper}
				args={[
					directionFlipped,
					position,
					Math.abs(motor.speed) * 0.2,
					0x00ff00
				]}
			/>
		{/if}
	{/each}
{/key}

{#key actualDirection}
	<T
		is={ArrowHelper}
		args={[
			new THREE.Vector3(...vector.asTuple(actualDirection)),
			new THREE.Vector3(0, 0, 0),
			vector.magnitude(actualDirection),
			0x00ff00
		]}
	/>
{/key}

{#key desiredDirection}
	<T
		is={ArrowHelper}
		args={[
			new THREE.Vector3(...vector.asTuple(desiredDirection)),
			new THREE.Vector3(0, 0, 0),
			vector.magnitude(desiredDirection),
			0xff0000
		]}
	/>
{/key}

<T.PerspectiveCamera
	makeDefault
	position={[1, 1, 1]}
	fov={36}
	target={[0, 0, 0]}
>
	<OrbitControls />
</T.PerspectiveCamera>

<Gizmo horizontalPlacement={'left'} />

<Grid
  sectionThickness={0}
  infiniteGrid
  cellColor="#dddddd"
  cellSize={2}
/>

<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[0, 10, 10]} />
