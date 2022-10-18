<script lang="ts">
	import Icon from 'svelte-awesome';
	import keyboardO from 'svelte-awesome/icons/keyboardO';
	import { writable } from "svelte/store"
	import { windowdata } from "./Windowcomp.svelte"
</script>

<div class="taskbar">
	<div on:click={() => $windowdata.keybinds = !$windowdata.keybinds} style="background: blue">
		<Icon data={keyboardO} />
	</div>
</div>

<style>
	.taskbar {
		position: fixed;
		bottom: 0;
		left: 0;
		border-style: solid;
		width: 100%;
		font-size: 2rem;
		border-image: linear-gradient(90deg, #42a5f5 0%, #0d47a1 100%) 1;
		background-color: #b6b6b6;
	}
</style>