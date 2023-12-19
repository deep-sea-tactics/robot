<script lang="ts">
	import ControllerHandler from '$lib/components/ControllerHandler.svelte';
</script>

<div class="wrap">
	<div class="grid">
		<div class="item">
			<p>test</p>
		</div>
		<div class="item">
			<p>test</p>
		</div>
		
	</div>
	<div class="bottomBar">
		<div class="item">
			<ControllerHandler />
		</div>
		<div class="item">
			<p>test</p>
		</div>
		<div class="item">
			<p>test</p>
		</div>
	</div>
</div>

<style>
	.item {
		/* the border color may be moved to just the bottomBar; camera is visually distinctive */
		flex: 1;
		border: 1px solid var(--accent);
	}

	.wrap {
		color: var(--text);
	}

	.grid {
		display: flex;
		min-height: 10vh;
		height: 80vh;
		display: flex;
	}
	.bottomBar {
		display: flex;
		height: 20vh;
		min-height: 10vh;
		background: var(--bgDark);
	}
</style>
