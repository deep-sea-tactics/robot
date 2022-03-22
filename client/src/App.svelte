<script lang="ts">
	import CameraBox from './camera/CameraBox.svelte'
	import ControllerCanvas from './controller/ControllerCanvas.svelte'
</script>
<main class="flex flex-row w-screen h-screen">
  <ControllerCanvas />
	<CameraBox />
</main>