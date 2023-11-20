<script lang="ts">
  import { T } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'

  const waterHeight = 5;
  const width = 50;
  const length = 80;

  const plateThickness = 0.3;
</script>

<T.PerspectiveCamera
  makeDefault
  position={[40, 40, 40]}
  on:create={({ ref }) => {
    ref.lookAt(0, 1, 0)
  }}
>
  <OrbitControls enableDamping />
</T.PerspectiveCamera>

<T.DirectionalLight position={[0, 10, 0]} castShadow />
<T.AmbientLight intensity={0.5} />

<T.Mesh
  position.y={1}
  position.z={-20}
  castShadow
>
  <T.BoxGeometry args={[1, 2, 1]} />
  <T.MeshStandardMaterial color="hotpink" />
</T.Mesh>

<T.Mesh rotation.x={-Math.PI/2} receiveShadow>
  <T.BoxGeometry args={[width, length, plateThickness]} />
  <T.MeshStandardMaterial color="white" />
</T.Mesh>

<T.Mesh rotation.x={-Math.PI/2} position={[0, (plateThickness + waterHeight) / 2, 0]} receiveShadow>
  <T.BoxGeometry args={[width, length, waterHeight]} />
  <T.MeshStandardMaterial color="lightblue" transparent opacity={0.5} />
</T.Mesh>

<T.Mesh position={[(width + plateThickness) / 2, (plateThickness + waterHeight) / 2, 0]} receiveShadow>
  <T.BoxGeometry args={[plateThickness, waterHeight + plateThickness * 2, length]} />
  <T.MeshStandardMaterial color="white" />
</T.Mesh>

<T.Mesh position={[-(width + plateThickness) / 2, (plateThickness + waterHeight) / 2, 0]} receiveShadow>
  <T.BoxGeometry args={[plateThickness, waterHeight + plateThickness * 2, length]} />
  <T.MeshStandardMaterial color="white" />
</T.Mesh>

<T.Mesh position={[0, (plateThickness + waterHeight) / 2, (length + plateThickness) / 2]} receiveShadow>
  <T.BoxGeometry args={[width, waterHeight + plateThickness * 2, plateThickness]} />
  <T.MeshStandardMaterial color="white" />
</T.Mesh>

<T.Mesh position={[0, (plateThickness + waterHeight) / 2, -(length + plateThickness) / 2]} receiveShadow>
  <T.BoxGeometry args={[width, waterHeight + plateThickness * 2, plateThickness]} />
  <T.MeshStandardMaterial color="white" />
</T.Mesh>
