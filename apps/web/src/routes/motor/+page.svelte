<script lang="ts">
	import { move } from 'robot/src/thrusters';
	import * as vector from 'vector';
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';

	let directionX = 0;
	let directionY = 0;
	let directionZ = 0;
	$: neutralDirection = directionX === 0 && directionY === 0 && directionZ === 0;

	function resetDirection() {
		directionX = 0;
		directionY = 0;
		directionZ = 0;
	}

	let torqueX = 0;
	let torqueY = 0;
	let torqueZ = 0;
	$: neutralTorque = torqueX === 0 && torqueY === 0 && torqueZ === 0;

	function resetTorque() {
		torqueX = 0;
		torqueY = 0;
		torqueZ = 0;
	}

	$: direction = vector.vector(directionX, directionY, directionZ);
	$: torque = vector.vector(torqueX, torqueY, torqueZ);
	$: result = move(direction, torque);
</script>

<svelte:head>
	<title>ROV Debugger</title>
</svelte:head>

<main>
	<h1>Motor Calculation Debugging</h1>

	<div class="body">
		<div class="input">
			<h2>
				Direction
				{#if !neutralDirection}
					<button on:click={resetDirection}>Reset</button>
				{/if}
			</h2>

			<p>[x: {directionX}, y: {directionY}, z: {directionZ}]</p>

			<div>
				<label for="directionX">X</label>
				<input type="range" min="-1" max="1" step="0.01" id="directionX" bind:value={directionX} />
			</div>
			<div>
				<label for="directionY">Y</label>
				<input type="range" min="-1" max="1" step="0.01" id="directionY" bind:value={directionY} />
			</div>
			<div>
				<label for="directionZ">Z</label>
				<input type="range" min="-1" max="1" step="0.01" id="directionZ" bind:value={directionZ} />
			</div>

			<h2>
				Torque
				{#if !neutralTorque}
					<button on:click={resetTorque}>Reset</button>
				{/if}
			</h2>

			<p>[x: {torqueX}, y: {torqueY}, z: {torqueZ}]</p>

			<div>
				<label for="torqueX">X</label>
				<input type="range" min="-1" max="1" step="0.01" id="torqueX" bind:value={torqueX} />
			</div>
			<div>
				<label for="torqueY">Y</label>
				<input type="range" min="-1" max="1" step="0.01" id="torqueY" bind:value={torqueY} />
			</div>
			<div>
				<label for="torqueZ">Z</label>
				<input type="range" min="-1" max="1" step="0.01" id="torqueZ" bind:value={torqueZ} />
			</div>
		</div>

		<div class="output">
			<!-- <pre><b>motors</b>: {JSON.stringify(result.motors, null,2)}</pre> -->
			<h2>Motors</h2>
			{#each result.motors as { type, speed }}
				<p>{type}: {speed}</p>
			{/each}
			<pre><b>torque difference</b>: {JSON.stringify(result.torqueDifference, null,2)}</pre>
			<pre><b>direction difference</b>: {JSON.stringify(result.directionDifference, null,2)}</pre>
		</div>

		<div class="canvas">
			<Canvas>
				<Scene
					motors={result.motors}
					desiredDirection={direction}
					actualDirection={result.resultingForce}
				/>
			</Canvas>
		</div>
	</div>
</main>

<style>
	h1 {
		text-align: center;
	}

	.canvas {
		width: 400px;
		height: 400px;
		border: 3px solid black;
		border-radius: 1rem;

		@media (prefers-color-scheme: dark) {
			border: 3px solid white;
		}
	}

	div.body {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 1rem;
	}

	@media (prefers-color-scheme: dark) {
		:global(body) {
			background-color: black;
			color: white;
		}
	}
</style>
