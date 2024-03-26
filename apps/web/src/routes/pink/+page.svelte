<script lang="ts">
    import SkeletonTestImage from './skeleton_test_image.jpg'
</script>

<main>
    <img src = {SkeletonTestImage} class = "cool skeleton" alt = "rad skeleton">
</main>

<style>
    .cool.skeleton {
        filter: invert(100%);
    }
</style>
