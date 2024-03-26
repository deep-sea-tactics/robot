<script lang="ts">
    import SkeletonTestImage from './skeleton_test_image_with_pink_rect.jpg'
    import template_image from './pink_rect.jpg'
    import {onMount} from 'svelte'
    import x_result from './main.svelte'
    import y_result from './main.svelte'
    
    export let test_image: HTMLImageElement;
    export let template_element: HTMLImageElement;

  //  export function load({ params })
 //   {
//
    //}
</script>

<main>
    <img bind:this={test_image} src = {SkeletonTestImage} alt = "rad skeleton">
    <img bind:this={template_element} src = {template_image} alt = "pink">

    <p>x: {x_result}</p>
    <p>y: {y_result}</p>
</main>
