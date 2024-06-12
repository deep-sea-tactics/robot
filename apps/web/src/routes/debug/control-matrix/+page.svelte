<script lang="ts">
	import * as math from 'mathjs';
	import { controlInverse, controlMatrix } from 'robot/src/thrusterCalculations';
	import Katex from 'svelte-katex';

	const matrixToLatex = (matrix: Readonly<math.MathCollection>) =>
		(
			matrix.map((arr) =>
				arr.map((value: number) => Math.round(value * 1000) / 1000).join(' & ')
			) as string[]
		).join('\\\\');

	const controlMatrixLatex = matrixToLatex(controlMatrix);
	const controlInverseLatex = matrixToLatex(controlInverse);
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css"
		integrity="sha384-MlJdn/WNKDGXveldHDdyRP1R4CTHr3FeuDNfhsLPYrq2t0UBkUdK2jyTnXPEK1NQ"
		crossorigin="anonymous"
	/>
</svelte:head>

<main>
	<h2>Control Matrix</h2>

	<Katex displayMode
		>\begin{'{bmatrix}'}
		{controlMatrixLatex}
		\end{'{bmatrix}'}
	</Katex>

	<h2>Control Matrix Inverse</h2>

	<Katex displayMode>
		\begin{'{bmatrix}'}
		{controlInverseLatex}
		\end{'{bmatrix}'}
	</Katex>
</main>

<style>
	main {
		text-align: center;
	}
</style>
