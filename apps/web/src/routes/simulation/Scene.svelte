<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { AutoColliders, RigidBody as RapierRigidBody, Collider } from '@threlte/rapier';
	import { OrbitControls } from '@threlte/extras';
	import { client } from '$lib/connections/robot';
	import { onMount } from 'svelte';
	import { Motor } from 'robot/src/motor';
	import { Gizmo } from '@threlte/extras';
	import { Box3, Vector3 } from 'three';
	import type { RigidBody } from '@leodog896/rapier3d-compat/dynamics/rigid_body';

	const inchesToMeters = (inches: number) => inches * 0.0254;

	const rovAngularDamping = 0;

	const t200_12v_max_newtons = 32.5;
	const thrustOffset = -30;

	interface MotorConstraint {
		type: Motor;
		position: Vector3;
		throttle: number;
		maxThrust: number;
		thrustDirection: Vector3;
	}

	function getForceVector(constraint: MotorConstraint): Vector3 {
		const currentThrust = constraint.maxThrust * constraint.throttle; //only assuming throttle is on the scale 0-1
		return constraint.thrustDirection.clone().normalize().multiplyScalar(currentThrust);
	}

	// world-building variables
	const waterHeight = 3;
	const width = 25;
	const length = 25;
	const plateThickness = 0.3;

	let rovMass = 10 + 10; //in kg

	let isRovInCollider = false;

	// in kg/m^3
	const waterDensity = 9.98;

	// in m/s^2
	const gravity = 9.807;

	let rovBox = new Box3();
	let waterBox = new Box3();

	let water: THREE.Mesh | null = null;
	let rov: THREE.Mesh | null = null;

	let rovBody: RigidBody | null = null;

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

	let thrusters: MotorConstraint[] = [
		{
			type: Motor.FrontLeft,
			position: new Vector3(0, 0, 0),
			throttle: 0,
			maxThrust: t200_12v_max_newtons + thrustOffset,
			thrustDirection: new Vector3(1, 0, 0)
		},
		{
			type: Motor.FrontRight,
			position: new Vector3(0, 0, 0),
			throttle: 0,
			maxThrust: t200_12v_max_newtons + thrustOffset,
			thrustDirection: new Vector3(1, 0, 0)
		},
		// assuming the sideback motors are mirrored relative to the sidefront motors
		{
			type: Motor.SideFront,
			position: new Vector3(0, -1, 1),
			throttle: 0,
			maxThrust: t200_12v_max_newtons + thrustOffset,
			thrustDirection: new Vector3(1, 0, 0)
		},
		{
			type: Motor.SideBack,
			position: new Vector3(0, -1, -1),
			throttle: 0,
			maxThrust: t200_12v_max_newtons + thrustOffset,
			thrustDirection: new Vector3(-1, 0, 0)
		},
		// assuming the topleft and topright motors are mirrored to the frontleft and frontright motors
		{
			type: Motor.TopLeft,
			position: new Vector3(1, 1, 0),
			throttle: 0,
			maxThrust: t200_12v_max_newtons + thrustOffset,
			thrustDirection: new Vector3(0, 0, -1)
		},
		{
			type: Motor.TopRight,
			position: new Vector3(-1, 1, 0),
			throttle: 0,
			maxThrust: t200_12v_max_newtons + thrustOffset,
			thrustDirection: new Vector3(0, 0, -1)
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
			console.log(e.key);
			if (e.key == 'p') {
				updateView(VIEWS.firstPerson);
			} else if (e.key == 'o') {
				updateView(VIEWS.thirdPerson);
			}
		});
	});

	let currentPosition = new Vector3(0, 0, 0);
	let cameraPosition = new Vector3(10, 10, 10);
	let cameraRotation = new Vector3(0, 0, 0);

	enum VIEWS {
		firstPerson = 'first',
		thirdPerson = 'third'
	}

	let currentView: VIEWS = VIEWS.firstPerson;

	let updateView = (view: VIEWS) => {
		switch (view) {
			case VIEWS.firstPerson:
				cameraPosition = currentPosition;
				currentView = VIEWS.firstPerson;
				break;

			case VIEWS.thirdPerson:
				cameraPosition = new Vector3(10, 10, 10);
				currentView = VIEWS.thirdPerson;
				break;

			default:
				break;
		}
	};

	useTask(() => {
		// We want full control over the forces applied to the ROV, so we reset them every frame
		rovBody?.resetForces(true);
		rovBody?.resetTorques(true);

		let rovBoundsSuccessfullyComputed = false;
		let waterBoundsSuccessfullyComputed = false;

		if (rovBody) {
			client?.simulationAccelerationData.mutate({
				accelerationValueX: rovBody?.userForce().x,
				accelerationValueY: rovBody?.userForce().y,
				accelerationValueZ: rovBody?.userForce().z,
			})
		}

		rov?.geometry.computeBoundingBox();

		if (rov?.geometry.boundingBox != null) {
			rovBox.copy(rov.geometry.boundingBox).applyMatrix4(rov.matrixWorld);
			rovBoundsSuccessfullyComputed = true;
		}

		water?.geometry.computeBoundingBox();

		if (water?.geometry.boundingBox != null) {
			waterBox.copy(water.geometry.boundingBox).applyMatrix4(water.matrixWorld);
			waterBoundsSuccessfullyComputed = true;
		}

		let volume: number;
		let waterRovIntersection: THREE.Box3 | undefined = undefined;

		if (
			rovBoundsSuccessfullyComputed &&
			waterBoundsSuccessfullyComputed &&
			waterBox.intersectsBox(rovBox)
		) {
			waterRovIntersection = waterBox.intersect(rovBox);
			const intersectionWHL = waterRovIntersection.max.sub(waterRovIntersection.min);
			volume = intersectionWHL.x * intersectionWHL.y * intersectionWHL.z;
		} else {
			volume = rovDimensions.reduce((acc, cur) => acc * cur, 1);
		}

		if (isRovInCollider && rov) {
			let buoyantForce = new Vector3(0, (-waterDensity * gravity * volume) / rovMass, 0);

			if (waterRovIntersection?.getCenter(new Vector3(0, 0, 0))) {
				rovBody?.addForceAtPoint(
					rov.localToWorld(buoyantForce),
					rov.localToWorld(waterRovIntersection.getCenter(new Vector3(0, 0, 0))),
					true
				);
			}

			for (const thruster of thrusters) {
				rovBody?.addForceAtPoint(
					rov.localToWorld(getForceVector(thruster)),
					rov.localToWorld(thruster.position),
					true
				);
			}
		}

		rovBody?.addForce(new Vector3(0, -gravity, 0), true);

		currentPosition = rovBox.getCenter(new Vector3());

		// camera stuff
		if (currentView == VIEWS.thirdPerson) {
			cameraPosition = currentPosition;
			cameraRotation = new Vector3(
				rovBody?.rotation().x,
				rovBody?.rotation().y || 0 - Math.PI / 2,
				rovBody?.rotation().z
			);
		}
	});

	// TODO: file a threlte/core issue to add this
	// to the core library instead of having to cast
	function cast<T>(value: unknown): T {
		return value as T;
	}

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

<!-- Sensor for the water; tells if the rov should actively try to escape the cold grasp of the big blue. (Definitely not stolen from threlte documentation)

The position of the water collider is where the water is, this may need to change at some point.

-->
<T.Group position={[0, (plateThickness + waterHeight) / 2, 0]}>
	<Collider
		on:sensorenter={() => (isRovInCollider = true)}
		on:sensorexit={() => (isRovInCollider = false)}
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
