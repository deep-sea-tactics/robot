<header>
	<h1>Debugging</h1>

	<div class="links">
		<a href="/debug/motor">Motor</a>
		<a href="/debug/controller">Controller</a>
	</div>
</header>

<slot />

<style lang="scss">
	:global(:root) {
		--background: #f1e3e4;
		--foreground: #1C1D21;
		--accent: #3B82F6;
	}

	:global(body) {
		background-color: var(--background);
		color: var(--foreground);
	}

	@media (prefers-color-scheme: dark) {
		:global(:root) {
			--background: #1C1D21;
			--foreground: #f1e3e4;
		}
	}

	header {
		display: flex;
		flex-direction: column;
		align-items: center;

		a {
			background-color: var(--foreground);
			color: var(--background);
			padding: 2px 4px;
		}
	}
</style>
