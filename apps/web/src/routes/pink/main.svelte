<script lang="ts">
    import cv from '@techstark/opencv-js'
    import { onMount } from 'svelte';

    let test_image: HTMLImageElement;
    let template_element: HTMLImageElement;

    export let x_result: Number;
    export let y_result: Number;

    let exit_code: Number = 1;

    onMount(() => 
    {
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
    })
</script>