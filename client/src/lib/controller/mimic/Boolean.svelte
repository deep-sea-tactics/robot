<script lang="ts">
	export let value: boolean;
</script>

{#if value}
	<span class="text-green-400">On</span>
{:else}
	<span class="text-red-400">Off</span>
{/if}
