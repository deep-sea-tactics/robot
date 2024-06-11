<script lang="ts">
	import '@fontsource/ibm-plex-mono';

	import '../style.scss';
</script>

<slot />

<style>
	:global(*) {
		font-family: sans-serif;
		box-sizing: border-box;
	}
</style>
