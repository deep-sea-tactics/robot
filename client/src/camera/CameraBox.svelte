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
		background-color: gray;
		width: 100%;
		height: 100%;
		display: flex;
		grid-area: camera;
		flex-wrap: wrap;
	}
</style>