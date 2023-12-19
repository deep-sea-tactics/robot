<svelte:head>
	<title>Robot</title>
</svelte:head>

<slot />

<style>
	:global(body) {
		margin: 0px;
		padding: 0px;
		background: #403d39;

		--bg: #403d39;
		--bgDark: #252422;
		--accent: #ccc9c0;
		--light: #bfb6a6;
		--text: #fffcf2;
	}

	:global(*) {
		box-sizing: border-box;
	}
</style>
