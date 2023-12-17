<script lang="ts">
	import { T, useFrame } from '@threlte/core';
	import { AutoColliders, Collider, RigidBody } from '@threlte/rapier';
	import { OrbitControls } from '@threlte/extras';

	type Vector3 = {
		x: number;
		y: number;
		z: number;
	};

	// world-building variables
	const waterHeight = 5;
	const width = 50;
	const length = 80;
	const plateThickness = 0.3;

	// Simulation math
	const waterVolume = width * length * waterHeight;
	const waterDensity = 1; //Looks silly, but I don't actually know if the water density will vary where we test :)
	const gravity = 9.81; //Earth's gravity. I don't know why you'd want to... uh... simulate an ROV on the moon, but you can? UNIT: M/s

	function buoyancy() {
		return -1 * waterDensity * gravity * waterVolume;
	}

	let rovPosition: Vector3 = { x: 0, y: 100, z: 0 };

	useFrame((state, delta) => {
		//You observe the well-crafted comment. Who could have built this, you ponder...
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

<T.Group position.x={rovPosition.x} position.y={rovPosition.y} position.z={rovPosition.z}>
	<RigidBody type={'dynamic'}>
		<T.Mesh>
			<T.BoxGeometry args={[1, 1, 1]} />
			<T.MeshBasicMaterial color="hotpink" />
		</T.Mesh>

		<Collider shape={'cuboid'} args={[0.5, 0.5, 0.5]} />
	</RigidBody>
</T.Group>

<T.Group rotation.x={-Math.PI / 2}>
	<AutoColliders>
		<T.Mesh receiveShadow>
			<T.BoxGeometry args={[width, length, plateThickness]} />
			<T.MeshStandardMaterial color="white" />
		</T.Mesh>
	</AutoColliders>
</T.Group>

<!--

<T.Mesh
  rotation.x={-Math.PI / 2}
  position={[0, (plateThickness + waterHeight) / 2, 0]}
  receiveShadow
>
  <T.BoxGeometry args={[width, length, waterHeight]} />
  <T.MeshStandardMaterial color="lightblue" transparent opacity={0.5} />
</T.Mesh>

-->

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
