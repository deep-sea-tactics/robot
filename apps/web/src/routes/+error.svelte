<script lang="ts">
	import { page } from '$app/stores';
</script>

<main>
	{#if $page.error}
		<h1>
			<span class="status">{$page.status}</span> <span class="gray">//</span>
			{$page.error.message}
		</h1>
		<a href="/">Return to ROV</a>
	{:else}
		<h1><b>Error:</b> No error?</h1>
	{/if}
</main>

<style lang="scss">
	main {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.status {
		color: var(--secondary);
	}

	a {
		color: var(--accent);
		text-decoration: underline;
	}

	:global(html, body) {
		height: 100%;
		margin: 0;
		padding: 0;
		background-color: var(--background);
		color: var(--foreground);
	}

	.gray {
		color: gray;
	}
</style>
