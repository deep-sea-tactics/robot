<script lang="ts">
	import * as cv from '@techstark/opencv-js';
	import { onMount } from 'svelte';
	import SkeletonTestImage from './skeleton_test_image_with_pink_rect.jpg';
	import template_image from './pink_rect.jpg';

	export let test_image: HTMLImageElement;
	export let template_element: HTMLImageElement;

	export let x_result: number;
	export let y_result: number;

	let exit_code = 1;

	onMount(() => {
		console.log(cv);
		alert('Did it even work');
		let source = cv.imread(test_image);
		let template = cv.imread(template_element);

		let dst = new cv.Mat();
		let mask = new cv.Mat();

		cv.matchTemplate(source, template, dst, cv.TM_CCOEFF, mask);
		let res = cv.minMaxLoc(dst, mask);

		let max_point = res.maxLoc;
		let point = new cv.Point(max_point.x + template.cols, max_point.y + template.rows);

		x_result = point.x;
		y_result = point.y;

		exit_code = 0;
	});
</script>

<main>
	<img bind:this={test_image} src={SkeletonTestImage} alt="rad skeleton" />
	<img bind:this={template_element} src={template_image} alt="pink" />

	<p>x: {x_result}</p>
	<p>y: {y_result}</p>
</main>
