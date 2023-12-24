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

	// in kg/m^3
	const waterDensity = 994;

	let water: THREE.Mesh | null = null;
	let rov: THREE.Mesh | null = null;

	// in m/s^2
	const gravity = 9.81;

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
		).multiplyScalar(delta * 100);

		rovBody?.applyImpulse(impulse, true);

		// if rov is in water
		if ((rov?.getWorldPosition(new Vector3(0, 0, 0))?.y ?? 0) < waterHeight) {
			rovBody?.applyImpulse(new Vector3(
				0,
				waterDensity * gravity * delta,
				0
			), true);
		}
	});

	// TODO: file a threlte/core issue to add this to the core library instead of having to cast
	function cast<T extends any>(value: unknown): T {
		return value as T;
	}

	const castThrelteRigidBody = (value: unknown): ThrelteRigidBody => cast<ThrelteRigidBody>(value);
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
	<RigidBody type={'dynamic'} on:create={({ ref: refUncasted }) => {
		const ref = castThrelteRigidBody(refUncasted);
		ref.setGravityScale(gravity, true);
		ref.setAdditionalMass(15, true);
		rovBody = ref
	}} linearDamping={0.1}>
		<T.Mesh
			on:create={({ ref }) => {
				rov = ref;
			}}
		>
			<T.BoxGeometry args={[1, 1, 1]} />
			<T.MeshBasicMaterial color="hotpink" />
		</T.Mesh>

		<Collider shape={'cuboid'} args={[0.5, 0.5, 0.5]} />
	</RigidBody>
</T.Group>

<T.Mesh
	on:create={({ ref }) => {
		water = ref;
	}}
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
