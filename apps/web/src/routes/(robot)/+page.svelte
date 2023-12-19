<script lang="ts">
	import ControllerHandler from '$lib/components/ControllerHandler.svelte';
</script>

<div class="wrap">
	<div class="grid flexContainer">
		<div class="item">
			<p>test</p>
		</div>
		<div class="item">
			<p>test</p>
		</div>
		<div class="item">
			<p>test</p>
		</div>
	</div>
	<div class="bottomBar flexContainer">
		<ControllerHandler />
	</div>
</div>

<style>
	.flexContainer > * {
		border: 1px solid var(--light);
		flex: 1;
	}

	.wrap {
		color: var(--text);
	}

	.grid {
		min-height: 10vh;
		height: 80vh;
		display: flex;
		flex-direction: row;
	}
	.bottomBar {
		height: 20vh;
		min-height: 10vh;
		background: var(--bgDark);
		flex-direction: row;
	}
</style>
