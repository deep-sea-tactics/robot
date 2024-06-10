<script lang="ts">
	import Simulation from './Simulation.svelte';
</script>

<svelte:head>
	<title>Simulation</title>
</svelte:head>

<Simulation client={undefined} />

<style>
	:global(html, body) {
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
	}
</style>
