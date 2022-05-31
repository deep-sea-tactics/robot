<script lang="ts">
    import { tick } from "svelte"
    import { screenshots } from "./screenshots"

    screenshots.subscribe(() => tick().then(() => {
        if ($screenshots.length == 0) return;

        const firstScreenshot = $screenshots[0];

        window.open(firstScreenshot.replace(
            /^data:image\/[^;]+/,
            "data:application/octet-stream"
        ))

        $screenshots = []
    }))
</script>