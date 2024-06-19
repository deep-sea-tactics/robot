<script lang="ts">
	import { VITE_MOCK } from '$env/static/public';
	import { page } from '$app/stores';
	const isMock = VITE_MOCK === 'true';
</script>

<svelte:head>
	<title>ROV Debugger</title>
</svelte:head>

<h1>Welcome to the <b>ROV Debugger!</b></h1>

<p>To get started, click on one of the tabs above.</p>

{#if $page.url.hostname.includes('github.io')}
	<p>
		<b class="note">NOTE</b>: This robot instance is running on GitHub Pages (<code
			>pnpm run build:static</code
		>)
	</p>
{:else if isMock}
	<p>
		<b class="note">NOTE</b>: This robot instance is running on mock mode (<code
			>pnpm run dev:mock</code
		>).
	</p>
{:else}
	<p>
		<b class="warning">WARNING</b>: This robot instance is running on production (<code
			>pnpm run dev</code
		>).
	</p>
{/if}

<style lang="scss">
	.warning {
		color: yellow;
	}

	.note {
		color: var(--accent);
	}

	code {
		background-color: rgb(0, 0, 0);
		padding: 0.25rem 0.5rem;
		color: var(--secondary);
	}
</style>
