<script lang="ts">
    import { tick } from "svelte"
    import { screenshots } from "./screenshots"
    import download from "downloadjs"

    screenshots.subscribe(() => tick().then(() => {
        if ($screenshots.length == 0) return;

        const firstScreenshot = $screenshots[0];

        download(firstScreenshot, "file.png", "image/png")

        $screenshots = []
    }))
</script>