<svelte:head>
	<title>Robot</title>
</svelte:head>

<slot />

<style>
	:global(body) {
		margin: 0px;
		padding: 0px;
		background: var(--background);
	}

	:global(*) {
		box-sizing: border-box;
	}
</style>
