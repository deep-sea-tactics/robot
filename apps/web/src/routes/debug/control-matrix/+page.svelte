<script lang="ts">
	import * as math from 'mathjs';
	import { thrusters, toHumanThruster } from 'robot/src/thruster';
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
	<title>Thruster Control Matrix</title>
</svelte:head>

<main>
	<h2>Control Matrix</h2>
	<p>
		Each column is a separate thruster, where the first three rows are force contributions and the
		last three rows are cross-product torque contributions. The motors are in the order {thrusters
			.map((thruster) => toHumanThruster(thruster.type))
			.join(', ')}
	</p>
	<p>
		<Katex displayMode
			>C = \begin{'{bmatrix}'}
			{controlMatrixLatex}
			\end{'{bmatrix}'}
			\begin{'{bmatrix}'}
			x\\ y\\ z\\ x_t\\ y_t\\ z_t \end{'{bmatrix}'}
		</Katex>
	</p>
	<h2>Control Matrix Inverse</h2>

	<Katex displayMode>
		C^{'{-1}'} = \begin{'{bmatrix}'}
		{controlInverseLatex}
		\end{'{bmatrix}'}
		\begin{'{bmatrix}'}
		x\\ y\\ z\\ x_t\\ y_t\\ z_t \end{'{bmatrix}'}
	</Katex>
</main>

<style>
	main {
		text-align: center;
	}
</style>
