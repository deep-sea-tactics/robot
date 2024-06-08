<script lang="ts">
	import { T } from '@threlte/core';
	import ROV from './ROV.svelte'
	import { OrbitControls, Grid, Stars, Gizmo } from '@threlte/extras'
	import { AmbientLight } from 'three';
</script>

<Stars />

<ROV position={[0.13 / 1000, -11.173 / 1000, 142.615 / 1000]}/>

<!--
	0.13 mm
	-11.773 mm
	-142.615 mm
 -->
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

<T.AmbientLight intensity={0.8} />
