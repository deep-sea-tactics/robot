<script lang="ts">
	import Camera from "./Camera.svelte"
</script>
<div id="cameras">
	<Camera src="http://192.168.1.201:8081/stream/webrtc"/>
	<Camera src="http://192.168.1.201:8082/stream/webrtc"/>
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