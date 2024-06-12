<script lang="ts">
	import { page } from '$app/stores';
	import PhWrenchFill from '~icons/ph/wrench-fill';
</script>

<div class="container">
	<header>
		<h1>ROV Debugger <PhWrenchFill /></h1>

		<div class="links">
			<a class:active={$page.url.toString().includes('/debug/thruster')} href="/debug/thruster"
				>Thruster</a
			>
			<a class:active={$page.url.toString().includes('/debug/controller')} href="/debug/controller"
				>Controller</a
			>
			<a
				class:active={$page.url.toString().includes('/debug/control-matrix')}
				href="/debug/control-matrix">Control Matrix</a
			>
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
		height: 100%;
		margin: 0;
		padding: 0;
	}

	@media (prefers-color-scheme: dark) {
		:global(:root) {
			--background: #1c1d21;
			--foreground: #f1e3e4;
		}
	}

	.active {
		background-color: var(--accent);
	}

	h1 {
		display: flex;
		gap: 1rem;
	}

	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.body {
		width: calc(100% - 2rem);
		height: calc(100% - 2rem);
		margin: 1rem;
	}

	.links {
		display: flex;
		gap: 1rem;
	}

	header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		border-bottom: 1px solid var(--foreground);

		a {
			background-color: var(--foreground);
			color: var(--background);
			padding: 2px 4px;
		}
	}
</style>
