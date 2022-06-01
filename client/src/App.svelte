<script lang="ts">
  import Camera from "./camera/Camera.svelte"
  import { cameras, type Camera as CameraType } from "./camera/camera"
	import ControllerCanvas from './controller/ControllerCanvas.svelte'
	import Screenshots from "./screenshots/Screenshots.svelte"

  let selectedCamera: CameraType | null = null
</script>
<svelte:window on:keypress={event => {
  if (event.key == "v")
    selectedCamera = cameras[(cameras.indexOf(selectedCamera) + 1) % cameras.length]
}}></svelte:window>
<main class="flex flex-row w-screen h-screen">
  <div class="w-1/5 flex flex-col">
    {#each cameras as camera}
      <div 
        class="w-full flex-grow p-8 flex justify-center items-center bg-lime-200 hover:bg-lime-300 active:bg-lime-400 transition-all text-xl" 
        class:bg-lime-300={selectedCamera == camera}
        on:click={() => selectedCamera = camera}
      >
        Camera {camera.port}
      </div>
    {/each}
    <div class="w-full flex-shrink p-2 flex justify-center items-center bg-gray-300">Press V to Cycle</div>
  </div>
  <div class="w-full">
    {#if selectedCamera}
      {#key selectedCamera}
        <Camera port={selectedCamera.port}/>
      {/key}
    {/if}
  </div>
  <Screenshots />
</main>
<div class="fixed bottom-0 right-0">
  <ControllerCanvas />
</div>