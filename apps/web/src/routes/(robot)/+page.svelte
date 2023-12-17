<script lang="ts">
	import ControllerHandler from '$lib/components/ControllerHandler.svelte';
</script>

<div class="wrap">
	<div class="grid" />
	<div class="bottomBar">
		<ControllerHandler />
	</div>
</div>

<style>
	.grid {
		min-height: 10vh;
		height: 80vh;
	}
	.bottomBar {
		height: 20vh;
		min-height: 10vh;
		background: var(--bgDark);
		display: flex;
		flex-direction: row;
	}
</style>
