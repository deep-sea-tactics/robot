<script lang="ts">
    import { screenshots } from "./screenshots"
</script>


{#each $screenshots as screenshot}
    <img src={screenshot} alt="Screenshot of robot"/>
{/each}