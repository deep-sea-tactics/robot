<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { AutoColliders, RigidBody, Collider } from '@threlte/rapier';
	import { OrbitControls } from '@threlte/extras';
	import { client } from '$lib/connections/robot';
	import { onMount } from 'svelte';
	import { Motor } from 'robot/src/motor';
	import { Gizmo } from '@threlte/extras';
	import type { ThrelteRigidBody } from '@threlte/rapier/dist/types/types';
	import { Box3, Vector3 } from 'three';

	const inchesToMeters = (inches: number) => inches * 0.0254;

	const t200_12v_max_newtons = 32.5

	class MotorConstraint
	{
		memb_type: Motor;
		memb_position: Vector3;
		memb_throttle: number;
		memb_max_thrust: number;
		memb_thrust_dir: Vector3; // unit vectors ONLY
		memb_current_thrust: number; //output

		constructor(motor_type: Motor, motor_position: Vector3, motor_throttle: number, motor_max_thrust: number, motor_thrust_direction: Vector3)
		{
			this.memb_type = motor_type;
			this.memb_position = motor_position;
			this.memb_throttle = motor_throttle;
			this.memb_max_thrust = motor_max_thrust;
			this.memb_current_thrust = 0; //init thrust
			this.memb_thrust_dir = motor_thrust_direction;
		}
		
		calculateMotorOutput(): number
		{
			this.memb_current_thrust = this.memb_max_thrust * this.memb_throttle //only assuming throttle is on the scale 0-1
			return this.memb_current_thrust
		}

		getForceVector(): Vector3
		{
			return new Vector3
			(
				this.memb_thrust_dir.x * this.memb_current_thrust,
				this.memb_thrust_dir.y * this.memb_current_thrust,
				this.memb_thrust_dir.z * this.memb_current_thrust
			)
		}
	}

	// world-building variables
	const waterHeight = 3;
	const width = 25; //Used as the Z variable for the water collider
	const length = 25; //Used as the X variable for the water collider
	const plateThickness = 0.3;

	// Simulation math
	$: waterVolume = width * length * waterHeight;

	let rovMass = 10; //in kg

	let isRovInCollider = false;

	// in kg/m^3
	const waterDensity = 998;

	// in m/s^2
	const gravity = 9.807;

	let rovBox = new Box3();
	let waterBox = new Box3();

	let water: THREE.Mesh | null = null;
	let rov: THREE.Mesh | null = null;
	let rovBody: ThrelteRigidBody | null = null;

	let rov_physics_group: THREE.Group | null = null;

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

	let thrusters: MotorConstraint[] = [];

	// TODO: populate thruster list from motor registry smth or other

	thrusters.push(new MotorConstraint(Motor.FrontLeft,new Vector3(1,0,0),1,t200_12v_max_newtons,new Vector3(1,0,0)))
	thrusters.push(new MotorConstraint(Motor.FrontRight,new Vector3(-1,0,0),1,t200_12v_max_newtons,new Vector3(1,0,0)))
	thrusters.push(new MotorConstraint(Motor.SideFront,new Vector3(0,-1,1),0,t200_12v_max_newtons,new Vector3(1,0,0)))
	thrusters.push(new MotorConstraint(Motor.SideBack,new Vector3(0,-1,-1),0,t200_12v_max_newtons,new Vector3(-1,0,0))) //assuming the sideback motors are mirrored relative to the sidefront motors
	thrusters.push(new MotorConstraint(Motor.TopLeft,new Vector3(1,1,0),0,t200_12v_max_newtons,new Vector3(0,0,-1)))
	thrusters.push(new MotorConstraint(Motor.TopRight,new Vector3(-1,1,0),0,t200_12v_max_newtons,new Vector3(0,0,-1))) //assuming the topleft and topright motors are mirrored to the frontleft and frontright motors

	onMount(() => {
		if (!client) throw new Error('No client found!');

		client.motorEvent.subscribe(undefined, {
			onData(value) {
				motorRegistry[value.motor] = value.speed;
			}
		});

		window.addEventListener('keypress', (e: KeyboardEvent) => {
			console.log(e.key)
			if(e.key == "p") {
				updateView(VIEWS.firstPerson)
			} else if (e.key == "o") {
				updateView(VIEWS.thirdPerson)
			}
		});
	});

	let past_position: Vector3 = new Vector3(0, 0, 0);
	let current_position: Vector3 = new Vector3(0, 0, 0);
	let cameraPosition: Vector3 = new Vector3(10, 10, 10)
	let cameraRotation: Vector3 = new Vector3(0, 0, 0)
	let past_speed: number = 0;
	let current_speed: number = 0;

	export let acceleration: number = 0;


	enum VIEWS {
		firstPerson = "first",
		thirdPerson ="third"
	}
	let currentView: VIEWS = VIEWS.firstPerson;

	let updateView = (view: VIEWS) => {
		switch (view) {
			case VIEWS.firstPerson: 
				cameraPosition = current_position;
				currentView = VIEWS.firstPerson
				break;
			
			case VIEWS.thirdPerson: 
				cameraPosition = new Vector3(10, 10, 10);
				currentView = VIEWS.thirdPerson
				break;
			
			default: 
				break;
			
		}
			
	}

	useTask((delta) => {
		// We want full control over the forces applied to the ROV, so we reset them every frame
		rovBody?.resetForces(true);
		rovBody?.resetTorques(true);

		let rovBoundsSuccessfullyComputed = false;
		let waterBoundsSuccessfullyComputed = false;

		past_position = current_position;

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
		if (
			rovBoundsSuccessfullyComputed &&
			waterBoundsSuccessfullyComputed &&
			waterBox.intersectsBox(rovBox)
		) {
			const waterRovIntersection = waterBox.intersect(rovBox);
			const intersectionWHL = waterRovIntersection.max.sub(waterRovIntersection.min);
			volume = intersectionWHL.x * intersectionWHL.y * intersectionWHL.z;
		} else {
			volume = rovDimensions.reduce((acc, cur) => acc * cur, 1);
		}

		console.log(volume);

		thrusters.forEach( (element: MotorConstraint) => 
		{
			element.calculateMotorOutput();
		})

		if (isRovInCollider) {
			rovBody?.addForce(new Vector3(0, 0 + (waterDensity * gravity * volume) / rovMass, 0), true);

			thrusters.forEach( (element: MotorConstraint) => 
			{
				rovBody?.addForceAtPoint(element.getForceVector(), element.memb_position,true);
			});
		} else {
			rovBody?.addForce(new Vector3(0, -gravity, 0), true);
		}

		current_position = rovBox.getCenter(new Vector3());

		if (current_position && past_position) {
			past_speed = current_speed;

			let distance_covered: number = new Vector3(
				current_position.x - past_position.x,
				current_position.y - past_position.y,
				current_position.z - past_position.z
			).length();
			current_speed = distance_covered / delta;
		}

		acceleration = (past_speed - current_speed) / delta;


		//camera stuff
		if(currentView == VIEWS.thirdPerson) {
			cameraPosition = current_position
			cameraRotation = new Vector3(rovBody?.rotation().x, rovBody?.rotation().y || 0 - Math.PI/2, rovBody?.rotation().z)
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
	position={[cameraPosition.x, cameraPosition.y, cameraPosition.z]}
	rotation={[cameraRotation.x, cameraRotation.y, cameraRotation.z]}
	on:create={({ ref }) => {
		
	}}
>
	<OrbitControls />
</T.PerspectiveCamera>

<T.DirectionalLight position={[0, 10, 0]} castShadow />
<T.AmbientLight intensity={0.5} />

<!-- 
The mesh below represents the ROV, and is a work in progress. Interactivity is limited and being improved upon
-->

<T.Group
	position.y={waterHeight}
	on:create={({ ref }) => {
		rov_physics_group = ref;
	}}
>
	<RigidBody
		type={'dynamic'}
		on:create={({ ref: refUncasted }) => {
			const ref = castThrelteRigidBody(refUncasted);

			ref.setAdditionalMass(rovMass, true);
			ref.setGravityScale(0, true);
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
