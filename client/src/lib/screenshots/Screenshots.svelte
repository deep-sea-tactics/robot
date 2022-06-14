<script lang="ts">
    import { tick } from "svelte"
    import { screenshot } from "./screenshots"
    import download from "downloadjs"

    screenshot.subscribe(() => tick().then(() => {
        if ($screenshot === null) return;

        download($screenshot, "file.png", "image/png")

        $screenshot = null
    }))
</script>