<script lang="ts">
	import { T } from '@threlte/core';
	import ROV from '../../lib/three/ROV.svelte'
	import { OrbitControls, Grid, Stars, Gizmo } from '@threlte/extras';
	import { getThruster, type MotorMovement } from 'robot/src/thrusters';
	import * as vector from 'vector';
	import PositionalArrow from '$lib/three/PositionalArrow.svelte';

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
		<PositionalArrow
			to={vector.add(position)(vector.scale(direction)(motor.speed))}
			from={position}
			color={0x00ff00}
		/>
	{/each}
{/key}

{#key actualDirection}
	<PositionalArrow
		to={vector.asTuple(vector.scale(actualDirection)(1/2))}
		from={[0, 0, 0]}
		color={0x00ff00}
	/>
{/key}

{#key desiredDirection}
	<PositionalArrow
		to={vector.asTuple(vector.scale(desiredDirection)(1/2))}
		from={[0, 0, 0]}
		color={0xff0000}
	/>
{/key}

<T.Mesh position={[...vector.asTuple(vector.scale(actualDirection)(1/2))]} scale={0.02}>
	<T.BoxGeometry />
	<T.MeshBasicMaterial color={"lightgreen"} />
</T.Mesh>

<T.Mesh position={[...vector.asTuple(vector.scale(desiredDirection)(1/2))]} scale={0.012}>
	<T.SphereGeometry />
	<T.MeshBasicMaterial color={"red"} />
</T.Mesh>

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
  cellSize={0.1}
/>

<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[0, 10, 10]} />
