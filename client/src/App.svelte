<script lang="ts">
	import CameraBox from './camera/CameraBox.svelte'
</script>
<main>
	<CameraBox />
</main>

<style lang="scss">
	main {
		display: grid; 
		grid-template-columns: 1fr max-content 1fr; 
		grid-template-rows: auto max-content auto; 
		gap: 0px 0px; 
		grid-template-areas: 
		"controller camera grip"
		"controller camera grip"
		"controller camera grip"; 
	}
</style>