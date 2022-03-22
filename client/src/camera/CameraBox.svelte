<script lang="ts">
	import Camera from "./Camera.svelte"
</script>
<div id="cameras">
	<Camera src="file:///home/daniel/LDST/Landstown-Robotics-Challenge/client/src/raw.html#8081"/>
	<Camera src="file:///home/daniel/LDST/Landstown-Robotics-Challenge/client/src/raw.html#8082"/>
</div>
<style lang="scss">
	#cameras {
		background-color: lightgray;
		width: 100%;
		height: 100vh;
		display: flex;
		grid-area: camera;
		flex-wrap: wrap;
	}
</style>