<div class="container">
	<header>
		<h1>Debugging</h1>

		<div class="links">
			<a href="/debug/thruster">Thruster</a>
			<a href="/debug/controller">Controller</a>
		</div>
	</header>

	<div class="body">
		<slot />
	</div>
</div>

<style lang="scss">
	:global(:root) {
		--background: #f1e3e4;
		--foreground: #1c1d21;
		--accent: #3b82f6;
	}

	:global(body) {
		background-color: var(--background);
		color: var(--foreground);
	}

	:global(html, body) {
		height: calc(100% - 2rem);
		margin: 1rem;
		padding: 0;
	}

	@media (prefers-color-scheme: dark) {
		:global(:root) {
			--background: #1c1d21;
			--foreground: #f1e3e4;
		}
	}

	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.body {
		width: 100%;
		height: 100%;
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
