<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { AutoColliders, RigidBody as RapierRigidBody, Collider } from '@threlte/rapier';
	import { OrbitControls } from '@threlte/extras';
	import { client } from '$lib/connections/robot';
	import { onMount } from 'svelte';
	import { Motor } from 'robot/src/motor';
	import { Gizmo } from '@threlte/extras';
	import { ArrowHelper, Box3, Quaternion, Vector3 } from 'three';
	import type { RigidBody } from '@leodog896/rapier3d-compat/dynamics/rigid_body';
	import type { Vector } from '@leodog896/rapier3d-compat';

	const rovAngularDamping = 0;

	const t200_12v_max_newtons = 32.5;
	const thrustOffset = -30;

	interface MotorConstraint {
		type: Motor;
		position: Vector3;
		throttle: () => number;
		maxThrust: number;
		thrustDirection: Vector3;
	}

	function getForceVector(constraint: MotorConstraint, rov: THREE.Mesh): Vector3 {
		 // assuming throttle is on the scale -1 - 1
		const currentThrust = constraint.maxThrust * constraint.throttle();
		return calculateThrusterDirection(
			constraint,
			rov,
		).clone().normalize().multiplyScalar(currentThrust);
	}

	// world-building variables
	const waterHeight = 3;
	const width = 25;
	const length = 25;
	const plateThickness = 0.3;

	// in kg
	let rovMass = 9;

	let rovInWater = false;

	// in kg/m^3
	const waterDensity = 9.98;

	// in m/s^2
	const gravity = 9.807;

	let rovBox = new Box3();
	let waterBox = new Box3();

	let water: THREE.Mesh | null = null;
	let rov: THREE.Mesh | null = null;

	let rovBody: RigidBody | null = null;

	// in [x, y, z]
	const rovDimensions = [
		// on the "side" of the ROV; where the main camera is not facing
		362.278 / 1000,
		276.23 / 1000,
		310 / 1000
	];

	// TODO: generate this from the motor enum
	let motorRegistry: Record<Motor, number> = {
		[Motor.BottomLeft]: 0,
		[Motor.BottomRight]: 0,
		[Motor.TopLeft]: 0,
		[Motor.TopRight]: 0,
		[Motor.VerticalLeft]: 0,
		[Motor.VerticalRight]: 0
	};

	// measured manually via fusion :}
	let thrusters: MotorConstraint[] = [
		{
			type: Motor.BottomLeft,
			position: new Vector3(85.075 / 1000, -67.57 / 1000, 95.417 / 1000),
			throttle: () => motorRegistry[Motor.BottomLeft],
			maxThrust: t200_12v_max_newtons + thrustOffset,
			thrustDirection: new Vector3(-1, 0, 1)
		},
		{
			type: Motor.BottomRight,
			position: new Vector3(85.075 / 1000, -67.57 / 1000, -95.417 / 1000),
			throttle: () => motorRegistry[Motor.BottomRight],
			maxThrust: t200_12v_max_newtons + thrustOffset,
			thrustDirection: new Vector3(-1, 0, -1)
		},
		{
			type: Motor.TopLeft,
			position: new Vector3(-114.204 / 1000, 65.297 / 1000, 103.873 / 1000),
			throttle: () => motorRegistry[Motor.TopLeft],
			maxThrust: t200_12v_max_newtons + thrustOffset,
			thrustDirection: new Vector3(1, 0, 1)
		},
		{
			type: Motor.TopRight,
			position: new Vector3(-114.204 / 1000, 65.297 / 1000, -103.873 / 1000),
			throttle: () => motorRegistry[Motor.TopRight],
			maxThrust: t200_12v_max_newtons + thrustOffset,
			thrustDirection: new Vector3(1, 0, -1)
		},
		{
			type: Motor.VerticalLeft,
			position: new Vector3(20.755 / 1000, 80.601 / 1000, 99.732 / 1000),
			throttle: () => motorRegistry[Motor.VerticalLeft],
			maxThrust: t200_12v_max_newtons + thrustOffset,
			thrustDirection: new Vector3(0, 1, 0)
		},
		{
			type: Motor.VerticalRight,
			position: new Vector3(20.755 / 1000, 80.601 / 1000, -99.732 / 1000),
			throttle: () => motorRegistry[Motor.VerticalRight],
			maxThrust: t200_12v_max_newtons + thrustOffset,
			thrustDirection: new Vector3(0, 1, 0)
		}
	];

	onMount(() => {
		if (!client) throw new Error('No client found!');

		client.motorEvent.subscribe(undefined, {
			onData(value) {
				motorRegistry[value.motor] = value.speed;
			}
		});

		window.addEventListener('keypress', (e: KeyboardEvent) => {
			if (e.key == 'p') {
				updateView(VIEWS.FirstPerson);
			} else if (e.key == 'o') {
				updateView(VIEWS.ThirdPerson);
			}
		});
	});

	let currentPosition = new Vector3(0, 0, 0);
	let cameraPosition = new Vector3(10, 10, 10);
	let cameraRotation = new Vector3(0, 0, 0);

	enum VIEWS {
		FirstPerson = 'first',
		ThirdPerson = 'third'
	}

	function vectorToVector3(vector: Vector): THREE.Vector3 {
		return new Vector3(vector.x, vector.y, vector.z);
	}

	let currentView: VIEWS = VIEWS.FirstPerson;

	let updateView = (view: VIEWS) => {
		switch (view) {
			case VIEWS.FirstPerson:
				cameraPosition = currentPosition;
				currentView = VIEWS.FirstPerson;
				break;

			case VIEWS.ThirdPerson:
				cameraPosition = new Vector3(10, 10, 10);
				currentView = VIEWS.ThirdPerson;
				break;

			default:
				break;
		}
	};

	function calculateThrusterPosition(
		thruster: MotorConstraint,
		rov: THREE.Mesh
	): Vector3 {
		return thruster.position
			.clone()
			.applyQuaternion(rov.getWorldQuaternion(new Quaternion()))
			.add(rov.getWorldPosition(new Vector3()));
	}
	
	function calculateThrusterDirection(
		thruster: MotorConstraint,
		rov: THREE.Mesh
	): Vector3 {
		return thruster.thrustDirection
			.clone()
			.applyQuaternion(rov.getWorldQuaternion(new Quaternion()));
	}

	/**
	 * Whether the simulation should prevent the ROV from floating.
	 * Currently, buoyancy is implemented wrong, so this is set to true.
	 */
	const counteractBuoyancy = true;

	useTask(() => {
		if (!water || !rov || !rovBody) return;

		// Many three.js functions allow
		// applying the result to some object;
		// we don't care about this, so these are our "void objects";
		// so we don't have to create a new one every frame
		let voidVector = new Vector3(0, 0, 0);
		let voidQuaternion = new Quaternion();

		// We want full control over the forces applied to the ROV, so we reset them every frame
		rovBody.resetForces(true);
		rovBody.resetTorques(true);

		rov.geometry.computeBoundingBox();
		rovBox.copy(rov.geometry.boundingBox!).applyMatrix4(rov.matrixWorld);

		water.geometry.computeBoundingBox();
		waterBox.copy(water.geometry.boundingBox!).applyMatrix4(water.matrixWorld);

		for (const thruster of thrusters) {
			rovBody.addForceAtPoint(
				getForceVector(thruster, rov),
				calculateThrusterPosition(thruster, rov),
				true
			);
		}

		if (counteractBuoyancy) {
			if (!rovInWater) {
				rovBody?.addForce(new Vector3(0, -gravity, 0), true);
			}
		} else {
			if (
				rovInWater &&
				waterBox.intersectsBox(rovBox)
			) {
				const waterRovIntersection = waterBox.intersect(rovBox);
				const { x, y, z } = waterRovIntersection.getSize(voidVector);
				const volume = x * y * z;

				let buoyantForce = new Vector3(0, (-waterDensity * gravity * volume), 0);

				if (waterRovIntersection?.getCenter(voidVector)) {
					rovBody?.addForceAtPoint(
						rov.localToWorld(buoyantForce),
						rov.localToWorld(waterRovIntersection.getCenter(voidVector)),
						true
					);
				}
			}

			rovBody.addForce(new Vector3(0, -gravity, 0), true);
		}

		currentPosition = rovBox.getCenter(new Vector3());

		// point the camera at the ROV
		if (currentView == VIEWS.ThirdPerson) {
			cameraPosition = currentPosition;
			cameraRotation = new Vector3(
				rovBody.rotation().x,
				rovBody.rotation().y || -Math.PI / 2,
				rovBody.rotation().z
			);
		}

		// send out all force data
		client?.simulationAccelerationData.mutate({
			accelerationValueX: rovBody.userForce().x,
			accelerationValueY: rovBody.userForce().y,
			accelerationValueZ: rovBody.userForce().z,
		});

		keyRovPositionChange = Symbol();
	});

	// TODO: file a threlte/core issue to add this
	// to the core library instead of having to cast
	function cast<T>(value: unknown): T {
		return value as T;
	}

	let keyRovPositionChange = Symbol();

	const castThrelteRigidBody = (value: unknown): RigidBody => cast<RigidBody>(value);
</script>

<T.PerspectiveCamera
	makeDefault
	position={[cameraPosition.x, cameraPosition.y, cameraPosition.z]}
	rotation={[cameraRotation.x, cameraRotation.y, cameraRotation.z]}
>
	<OrbitControls />
</T.PerspectiveCamera>

<T.DirectionalLight position={[0, 10, 0]} castShadow />
<T.AmbientLight intensity={0.5} />

{#key keyRovPositionChange}
	{#if rov}
		{#each thrusters as thruster}
			<T 
				is={ArrowHelper}
				args={[
					calculateThrusterDirection(thruster, rov),
					calculateThrusterPosition(thruster, rov),
					0.5,
					0xff0000
				]}
			/>
		{/each}
	{/if}
{/key}

<!-- 
The mesh below represents the ROV, and is a work in progress. Interactivity is limited and being improved upon
-->

<T.Group position.y={waterHeight}>
	<RapierRigidBody
		type={'dynamic'}
		on:create={({ ref: refUncasted }) => {
			const ref = castThrelteRigidBody(refUncasted);

			ref.setAdditionalMass(rovMass, true);
			ref.setGravityScale(0, true);
			ref.setAngularDamping(rovAngularDamping);
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

		<Collider
			shape={'cuboid'}
			args={[rovDimensions[0] / 2, rovDimensions[1] / 2, rovDimensions[2] / 2]}
		/>
	</RapierRigidBody>
</T.Group>

<!--
Sensor for the water; for buoyancy calculations
The position of the water collider is where the water is;
this may need to change at some point.
-->
<T.Group position={[0, (plateThickness + waterHeight) / 2, 0]}>
	<Collider
		on:sensorenter={() => (rovInWater = true)}
		on:sensorexit={() => (rovInWater = false)}
		sensor
		shape={'cuboid'}
		args={[width / 2, waterHeight / 2, length / 2]}
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
