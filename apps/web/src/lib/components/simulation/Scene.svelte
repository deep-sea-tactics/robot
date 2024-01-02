<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { AutoColliders, RigidBody, Collider } from '@threlte/rapier';
	import { OrbitControls } from '@threlte/extras';
	import { client } from '$lib/connections/robot';
	import { onMount } from 'svelte';
	import { Motor } from 'robot/src/motor';
	import { Gizmo } from '@threlte/extras';
	import { Debug } from '@threlte/rapier'
	import type { ThrelteRigidBody } from '@threlte/rapier/dist/types/types';
	import { Vector3 } from 'three';

	const inchesToMeters = (inches: number) => inches * 0.0254;

	// world-building variables
	const waterHeight = 3;
	const width = 25; //Used as the Z variable for the water collider
	const length = 25; //Used as the X variable for the water collider
	const plateThickness = 0.3;

	// Simulation math
	$: waterVolume = width * length * waterHeight;
	let forceActingOnRov = new Vector3(0, 0, 0)

	//Simulation logic
	export let isRovInCollider: boolean = false

	// in kg/m^3
	const waterDensity = 994;

	let water: THREE.Mesh | null = null;
	let rov: THREE.Mesh | null = null;

	// in m/s^2
	const gravity = 9.807;

	let rovBody: ThrelteRigidBody | null = null;

	const rovDimensions = [inchesToMeters(15), inchesToMeters(16.5), inchesToMeters(11)];

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
		
		// We want full control over the forces applied to the ROV, so we reset them every frame
		rovBody?.resetForces(true);

		const force = new Vector3(
			motorRegistry[Motor.FrontLeft] + motorRegistry[Motor.FrontRight],
			motorRegistry[Motor.TopLeft] + motorRegistry[Motor.TopRight],
			motorRegistry[Motor.SideFront] + motorRegistry[Motor.SideBack]
		).multiplyScalar(delta * 100);

		rovBody?.addForce(force, true);

		const volume = rovDimensions.reduce((acc, cur) => acc * cur, 1);

		// if rov is in water
		// TODO: check based on if they're in the water collider (Being worked on as we speak)
		


		//if ((rov?.getWorldPosition(new Vector3(0, 0, 0))?.y ?? 0) < waterHeight) {
		if (isRovInCollider) {
			rovBody?.addForce(
				new Vector3(
					forceActingOnRov.x,
					// TODO: Replace this calculation with a calculation for the ROV in MPS. The buoyancy formula outputs newtons.
					forceActingOnRov.y + waterDensity * gravity * volume * 3,
					forceActingOnRov.z
				),
				true
			);
		}
		//}
	});

	// TODO: file a threlte/core issue to add this to the core library instead of having to cast
	function cast<T extends any>(value: unknown): T {
		return value as T;
	}

	const castThrelteRigidBody = (value: unknown): ThrelteRigidBody => cast<ThrelteRigidBody>(value);
</script>

<Debug
  depthTest={false}
  depthWrite={false}
/>

<T.PerspectiveCamera
	makeDefault
	position={[15, 15, 15]}
	on:create={({ ref }) => {
		ref.lookAt(0, 1, 0);
	}}
>
	<OrbitControls />
</T.PerspectiveCamera>

<T.DirectionalLight position={[0, 10, 0]} castShadow />
<T.AmbientLight intensity={0.5} />

<!-- 
The mesh below represents the ROV, and is a work in progress. Interactivity is limited and being improved upon
-->

<T.Group position.y={waterHeight}>
	<RigidBody
		type={'dynamic'}
		on:create={({ ref: refUncasted }) => {
			const ref = castThrelteRigidBody(refUncasted);
			ref.setGravityScale(gravity, true);
			ref.setAdditionalMass(12, true);
			rovBody = ref;
		}}
		linearDamping={0.1}
	>
		<T.Mesh
			on:create={({ ref }) => {
				rov = ref;
			}}
		>
			<T.BoxGeometry args={rovDimensions} />
			<T.MeshBasicMaterial color="hotpink" />
		</T.Mesh>

		<Collider shape={'cuboid'} args={[rovDimensions[0]/2,rovDimensions[1]/2,rovDimensions[2]/2]} />
	</RigidBody>
</T.Group>

<!-- Sensor for the water; tells if the rov should actively try to escape the cold grasp of the big blue. (Definitely not stolen from threlte documentation)

The position of the water collider is where the water is, this may need to change at some point.

-->
<T.Group position={[0, (plateThickness + waterHeight) / 2, 0]}> 
	<Collider
	  on:sensorenter={() => (isRovInCollider = true)}
	  on:sensorexit={() => (isRovInCollider = false)}
	  sensor
	  shape={'cuboid'}
	  args={[width/2, waterHeight/2, length/2]}
	/>
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

