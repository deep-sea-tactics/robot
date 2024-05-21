<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { AutoColliders, RigidBody as RapierRigidBody, Collider } from '@threlte/rapier';
	import { OrbitControls } from '@threlte/extras';
	import { client } from '$lib/connections/robot';
	import { onMount } from 'svelte';
	import { Motor } from 'robot/src/motor';
	import { Gizmo } from '@threlte/extras';
	import { ArrowHelper, Box3, Quaternion, Vector3, type Mesh } from 'three';
	import type { RigidBody } from '@leodog896/rapier3d-compat/dynamics/rigid_body';
	import * as vector from 'vector';
	import { thrusters as robotThrusters } from 'robot/src/thrusters';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { useLoader } from '@threlte/core';

	const rovAngularDamping = 0;

	const gltfModel = useLoader(GLTFLoader).load('./robot.glb');
	const current_profiler = useLoader(GLTFLoader).load('./current_profiler.glb');
	const multifunction_node = useLoader(GLTFLoader).load('./multifunction_node.glb');
	const power_connector = useLoader(GLTFLoader).load('./power_connector.glb');
	const waypoint1 = useLoader(GLTFLoader).load('./waypoint1.glb');

	interface MotorConstraint {
		type: Motor;
		position: Vector3;
		throttle: () => number;
		maxThrust: number;
		thrustDirection: Vector3;
	}

	function getForceVector(constraint: MotorConstraint, rov: Mesh): Vector3 {
		// assuming throttle is on the scale -1 - 1
		const currentThrust = constraint.maxThrust * constraint.throttle();
		return calculateThrusterDirection(constraint, rov)
			.clone()
			.normalize()
			.multiplyScalar(currentThrust);
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

	let water: Mesh | null = null;
	let rov: Mesh | null = null;

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

	function toVector3(vector: vector.Vector): Vector3 {
		return new Vector3(vector.x, vector.y, vector.z);
	}

	const thrusters: MotorConstraint[] = robotThrusters.map((thruster) => ({
		...thruster,
		throttle: () => motorRegistry[thruster.type],
		position: toVector3(thruster.position),
		thrustDirection: toVector3(thruster.thrustDirection)
	}));

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

	let currentPosition = new Vector3(0, waterHeight, 0);
	let cameraPosition = new Vector3(10, 10, 10);
	let cameraRotation = new Vector3(0, 0, 0);

	enum VIEWS {
		FirstPerson = 'first',
		ThirdPerson = 'third'
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

	function calculateThrusterPosition(thruster: MotorConstraint, rov: Mesh): Vector3 {
		return thruster.position.clone().applyQuaternion(rov.getWorldQuaternion(new Quaternion()));
	}

	function calculateThrusterDirection(thruster: MotorConstraint, rov: Mesh): Vector3 {
		return thruster.thrustDirection
			.clone()
			.applyQuaternion(rov.getWorldQuaternion(new Quaternion()));
	}

	/**
	 * Whether the simulation should prevent the ROV from floating.
	 * Currently, buoyancy is implemented wrong, so this is set to true.
	 */
	const counteractBuoyancy = true;

	function addForceAtPoint(
		force: vector.VectorLike,
		point: vector.VectorLike
	): [force: vector.Vector, torque: vector.Vector] {
		return [vector.stabilize(force), vector.cross(point)(force)];
	}

	useTask(() => {
		if (!water || !rov || !rovBody) return;

		// Many three.js functions allow
		// applying the result to some object;
		// we don't care about this, so these are our "void objects";
		// so we don't have to create a new one every frame
		let voidVector = new Vector3(0, 0, 0);

		// We want full control over the forces applied to the ROV, so we reset them every frame
		rovBody.resetForces(true);
		rovBody.resetTorques(true);

		let force = vector.vector(0, 0, 0);
		let torque = vector.vector(0, 0, 0);

		rov.geometry.computeBoundingBox();
		rovBox.copy(rov.geometry.boundingBox!).applyMatrix4(rov.matrixWorld);

		water.geometry.computeBoundingBox();
		waterBox.copy(water.geometry.boundingBox!).applyMatrix4(water.matrixWorld);

		for (const thruster of thrusters) {
			const [addedForce, addedTorque] = addForceAtPoint(
				getForceVector(thruster, rov),
				calculateThrusterPosition(thruster, rov)
			);

			force = vector.add(force)(addedForce);
			torque = vector.add(torque)(addedTorque);
		}

		if (counteractBuoyancy) {
			if (!rovInWater) {
				force = vector.add(force)([0, -gravity, 0]);
			}
		} else {
			if (rovInWater && waterBox.intersectsBox(rovBox)) {
				const waterRovIntersection = waterBox.intersect(rovBox);
				const { x, y, z } = waterRovIntersection.getSize(voidVector);
				const volume = x * y * z;

				let buoyantForce = new Vector3(0, -waterDensity * gravity * volume, 0);

				if (waterRovIntersection?.getCenter(voidVector)) {
					const [addedForce, addedTorque] = addForceAtPoint(
						buoyantForce,
						waterRovIntersection.getCenter(voidVector)
					);

					force = vector.add(force)(addedForce);
					torque = vector.add(torque)(addedTorque);
				}
			}

			force = vector.add(force)([0, -gravity, 0]);
		}

		currentPosition = new Vector3(...vector.asTuple(rovBody.translation()));

		// point the camera at the ROV
		if (currentView == VIEWS.ThirdPerson) {
			cameraPosition = new Vector3(...currentPosition);
			cameraRotation = new Vector3(
				rovBody.rotation().x,
				rovBody.rotation().y || -Math.PI / 2,
				rovBody.rotation().z
			);
		}

		rovBody.addForce(force, true);
		rovBody.addTorque(torque, true);

		// send out all force data
		client?.simulationAccelerationData.mutate({
			x: force.x,
			y: force.y,
			z: force.z
		});

		// send out current rotation
		client?.simulationGyroscopeData.mutate({
			x: rovBody.angvel().x,
			y: rovBody.angvel().y,
			z: rovBody.angvel().z
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
					calculateThrusterPosition(thruster, rov).add(currentPosition),
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
			{#if $gltfModel}
				<T is={$gltfModel?.scene} scale={0.001} rotation={[0, Math.PI / 2, 0]} />
			{/if}

			<T.MeshBasicMaterial color="rgba(0, 0, 0, 0)" />
		</T.Mesh>

		<Collider
			shape={'cuboid'}
			args={[rovDimensions[0] / 2, rovDimensions[1] / 2, rovDimensions[2] / 2]}
		/>
	</RapierRigidBody>
</T.Group>

<!--
The following are props
-->
{#if $current_profiler}
	<T is={$current_profiler?.scene} />
{/if}
{#if $multifunction_node}
	<T is={$multifunction_node?.scene} />
{/if}
{#if $power_connector}
	<T is={$power_connector?.scene} />
{/if}
{#if $waypoint1}
	<T is={$waypoint1?.scene} />
{/if}

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
