<script lang="ts">
	import '@fontsource-variable/jetbrains-mono';

	import '../style.scss';
</script>

<slot />

<style>
	:global(*) {
		font-family: sans-serif;
		box-sizing: border-box;
	}
</style>
