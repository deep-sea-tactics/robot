<script lang="ts">
	import Camera from "./Camera.svelte"
</script>
<div id="cameras" class="w-2/3 h-screen flex flex-wrap bg-gray-100">
	<Camera src="http://192.168.1.201:8081/stream/webrtc"/>
	<Camera src="http://192.168.1.201:8082/stream/webrtc"/>
</div>