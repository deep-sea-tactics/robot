<script lang="ts">
	import Camera from "./Camera.svelte"
</script>
<div id="cameras" class="w-2/3 h-screen flex flex-wrap bg-gray-100">
	<Camera port={8081}/>
	<Camera port={8083} asyncOpen/>
	<Camera port={8082} asyncOpen/>
</div>
