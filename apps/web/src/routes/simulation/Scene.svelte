<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { AutoColliders, RigidBody, Collider } from '@threlte/rapier';
	import { OrbitControls } from '@threlte/extras';
	import { client } from '$lib/connections/robot';
	import { onMount } from 'svelte';
	import { Motor } from 'robot/src/motor';
	import { Gizmo } from '@threlte/extras';
	import type { ThrelteRigidBody } from '@threlte/rapier/dist/types/types';
	import { Vector3 } from 'three';

	// world-building variables
	const waterHeight = 7;
	const width = 50;
	const length = 80;
	const plateThickness = 0.3;

	// Simulation math
	$: waterVolume = width * length * waterHeight;

	const waterDensity = 1;

	// Earth's gravity. I don't know why you'd want to... uh... simulate an ROV on the moon, but you can? UNIT: M/s
	const gravity = 9.81;

	function buoyancy() {
		return -1 * waterDensity * gravity * waterVolume;
	}

	let rovBody: ThrelteRigidBody | null = null;

	// TODO: generate this from the motor enum
	let motorRegistry: Record<Motor, number> = {
		[Motor.FrontLeft]: 0,
		[Motor.FrontRight]: 0,
		[Motor.SideFront]: 0,
		[Motor.SideBack]: 0,
		[Motor.TopLeft]: 0,
		[Motor.TopRight]: 0
	};

	onMount(() => {
		if (!client) throw new Error('No client found!');

		client.motorEvent.subscribe(undefined, {
			onData(value) {
				motorRegistry[value.motor] = value.speed;
			}
		});
	});

	useTask((delta) => {
		const impulse = new Vector3(
			motorRegistry[Motor.FrontLeft] + motorRegistry[Motor.FrontRight],
			motorRegistry[Motor.TopLeft] + motorRegistry[Motor.TopRight],
			motorRegistry[Motor.SideFront] + motorRegistry[Motor.SideBack]
		).multiplyScalar(delta * 5);

		rovBody?.applyImpulse(impulse, true);
	});
</script>

<T.PerspectiveCamera
	makeDefault
	position={[40, 40, 40]}
	on:create={({ ref }) => {
		ref.lookAt(0, 1, 0);
	}}
>
	<OrbitControls />
</T.PerspectiveCamera>

<T.DirectionalLight position={[0, 10, 0]} castShadow />
<T.AmbientLight intensity={0.5} />

<!-- 
The mesh below represents the ROV, and is a work in progress. Interactivity is limited and just for testing.

A navigation node system will be added at some point; adding nodes for the ROV to follow and etc. is a work in progress.
-->

<T.Group position.y={waterHeight / 2}>
	<RigidBody type={'dynamic'} on:create={({ ref }) => (rovBody = ref)} linearDamping={0.1}>
		<T.Mesh>
			<T.BoxGeometry args={[1, 1, 1]} />
			<T.MeshBasicMaterial color="hotpink" />
		</T.Mesh>

		<Collider shape={'cuboid'} args={[0.5, 0.5, 0.5]} />
	</RigidBody>
</T.Group>

<T.Mesh
	rotation.x={-Math.PI / 2}
	position={[0, (plateThickness + waterHeight) / 2, 0]}
	receiveShadow
>
	<T.BoxGeometry args={[width, length, waterHeight]} />
	<T.MeshStandardMaterial color="lightblue" transparent opacity={0.2} />
</T.Mesh>

<AutoColliders>
	<T.Group rotation.x={-Math.PI / 2}>
		<T.Mesh receiveShadow>
			<T.BoxGeometry args={[width, length, plateThickness]} />
			<T.MeshStandardMaterial color="white" />
		</T.Mesh>
	</T.Group>

	<T.Mesh
		position={[(width + plateThickness) / 2, (plateThickness + waterHeight) / 2, 0]}
		receiveShadow
	>
		<T.BoxGeometry args={[plateThickness, waterHeight + plateThickness * 2, length]} />
		<T.MeshStandardMaterial color="white" />
	</T.Mesh>

	<T.Mesh
		position={[-(width + plateThickness) / 2, (plateThickness + waterHeight) / 2, 0]}
		receiveShadow
	>
		<T.BoxGeometry args={[plateThickness, waterHeight + plateThickness * 2, length]} />
		<T.MeshStandardMaterial color="white" />
	</T.Mesh>

	<T.Mesh
		position={[0, (plateThickness + waterHeight) / 2, (length + plateThickness) / 2]}
		receiveShadow
	>
		<T.BoxGeometry args={[width, waterHeight + plateThickness * 2, plateThickness]} />
		<T.MeshStandardMaterial color="white" />
	</T.Mesh>

	<T.Mesh
		position={[0, (plateThickness + waterHeight) / 2, -(length + plateThickness) / 2]}
		receiveShadow
	>
		<T.BoxGeometry args={[width, waterHeight + plateThickness * 2, plateThickness]} />
		<T.MeshStandardMaterial color="white" />
	</T.Mesh>
</AutoColliders>

<Gizmo />
