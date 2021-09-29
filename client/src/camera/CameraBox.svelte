<script lang="ts">
	import Camera from "./Camera.svelte"
</script>
<div id="cameras">
	<Camera />
	<Camera />
	<Camera />
	<Camera />
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