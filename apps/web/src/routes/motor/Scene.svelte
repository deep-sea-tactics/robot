<script lang="ts">
	import { T } from '@threlte/core';
	import ROV from './ROV.svelte'
	import { OrbitControls, Grid, Stars, Gizmo } from '@threlte/extras';
	import { getThruster, type MotorMovement } from 'robot/src/thrusters';
	import { ArrowHelper } from 'three';
	import * as vector from 'vector';
	import * as THREE from 'three';
	import Arrow from '$lib/three/Arrow.svelte';

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
		{@const direction = vector.asTuple(thruster.thrustDirection)}
		{@const position = vector.asTuple(thruster.position)}
		<Arrow to={direction} from={position} length={motor.speed * .2} color={0x00ff00} />
	{/each}
{/key}

{#key actualDirection}
	<Arrow
		to={vector.asTuple(actualDirection)}
		from={[0, 0, 0]}
		length={vector.magnitude(actualDirection)}
		color={0x00ff00}
	/>
{/key}

<T.Mesh position={[...vector.asTuple(actualDirection)]} scale={0.02}>
	<T.BoxGeometry />
	<T.MeshBasicMaterial color={"lightgreen"} />
</T.Mesh>

<T.Mesh position={[...vector.asTuple(desiredDirection)]} scale={0.012}>
	<T.SphereGeometry />
	<T.MeshBasicMaterial color={"red"} />
</T.Mesh>

{#key desiredDirection}
	<Arrow
		to={vector.asTuple(desiredDirection)}
		from={[0, 0, 0]}
		length={vector.magnitude(desiredDirection)}
		color={0xff0000}
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
