<!-- Testing page for beeping -->

<script lang="ts">
	import { beep } from "$lib/beep"
</script>

<button class="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] px-4 py-2 rounded-md shadow-md bg-blue-200" on:click={() => beep()}>BEEP!</button>