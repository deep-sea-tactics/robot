<script lang="ts">
	import { controlInverse } from 'robot/src/thrusterCalculations';
	import Katex from 'svelte-katex';

	console.log(controlInverse)
	const controlInverseLatex = (controlInverse.map(arr => arr.map((value: number) => Math.round(value * 100) / 100).join(" & ")) as string[]).join("\\\\")

</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css" integrity="sha384-MlJdn/WNKDGXveldHDdyRP1R4CTHr3FeuDNfhsLPYrq2t0UBkUdK2jyTnXPEK1NQ" crossorigin="anonymous">
</svelte:head>

<Katex displayMode>\begin{'{bmatrix}'}
{controlInverseLatex}
\end{'{bmatrix}'}
</Katex>
