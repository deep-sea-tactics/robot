<script lang="ts">
	import Camera from "./Camera.svelte"
</script>
<div id="cameras" class="h-screen flex flex-wrap">
	<Camera port={8081}/>
	<Camera port={8083} asyncOpen/>
	<Camera port={8082} asyncOpen/>
</div>
