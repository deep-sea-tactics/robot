<script lang="ts">
	import CameraBox from './camera/CameraBox.svelte'
	import ControllerCanvas from './controller/ControllerCanvas.svelte'
	import Screenshots from "./screenshots/Screenshots.svelte"
</script>
<main class="flex flex-row w-screen h-screen">
  <ControllerCanvas />
  <CameraBox />
  <Screenshots />
</main>