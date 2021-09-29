<script lang="ts">
	import CameraBox from './camera/CameraBox.svelte'
	import ControllerCanvas from './controller/ControllerCanvas.svelte'
</script>
<main>
	<ControllerCanvas />
	<CameraBox />
</main>

<style lang="scss">
	main {
		display: grid; 
		grid-template-columns: 1fr max-content 1fr; 
		grid-template-rows: 1fr max-content 1fr; 
		gap: 0px 0px; 
		grid-template-areas: 
		"controller camera camera"
		"controller camera camera"
		"controller camera camera"; 
	}
</style>