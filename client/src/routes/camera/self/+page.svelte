<script lang="ts">
	import { onDestroy } from 'svelte';
  import CameraDisplay from "$lib/camera/CameraDisplay.svelte"

  let stream: MediaStream;

	async function getMedia(): Promise<MediaStream> {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
      });
      
      return stream;
    } catch (err) {
      alert(err)
      throw "NO camera found"
    }
  }

  onDestroy(() => {
    if (!stream) return;
    for (const track of [...stream.getTracks()]) {
      track.stop()
      stream.removeTrack(track)
    }
  })
</script>

{#await getMedia()}
  <p>Waiting for Camera</p>
{:then mediaStream}
  <div class="m-16 bg-gray-100 flex flex-col p-8 rounded-lg shadow-lg">
    <CameraDisplay classes="h-[50vh] shrink" {mediaStream}/>
    <div class="h-1/2 grow">
      <p>Streaming Status</p>
    </div>
  </div>
{/await}