<script lang="ts">
    import CameraDisplay from "$lib/camera/CameraDisplay.svelte";
import { each } from "svelte/internal";

	let randomColor = () => {
		return(Math.floor(Math.random()*16777215).toString(16));
	}
	let random = (max) => {
		return(Math.floor(Math.random() * max));
	}

	//set a random number of streams to set resizability
	window.setInterval(() => {
		console.log('test')
		let tempRandom = random(16)
		streams = []
		for(var i = 0; i <= tempRandom; i++) {
			streams.push({id: random(89999) + 10000, color: randomColor()})
		}
	}, 3000)

	let streams: Stream[] = [
		{id: "78686", color: randomColor()},
	]
	let schema: any;
	let height: any;
	let streamsLength = streams.length;
	let width: any;
	$: schema = {height: height, width: width, columns: Math.ceil(Math.sqrt(streams.length)), rows: Math.round(Math.sqrt(streams.length))}
	$: console.log(schema)

	interface Stream {
		id: string;
		color?: string;
	}

	
	console.log(streams)
</script>

<div class="container" style="--rows: {schema.rows}; --columns: {schema.columns}" bind:clientHeight={height} bind:clientWidth={width}>
	{#each streams as camera}
		<div style="background: #{camera.color}">{camera.id}</div>
	{/each}
</div>

<style>
	.container {
		height: 100%;
		width: 100%;
		display: inline-grid;
		grid-template-rows: repeat(var(--rows), calc(100%/var(--rows)));
		grid-template-columns: repeat(var(--columns), calc(100%/var(--columns)));
	}
	.container div {
	}
</style>