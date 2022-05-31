<script lang="ts">
  import Camera from "./camera/Camera.svelte"
  import { cameras, type Camera as CameraType } from "./camera/camera"
	import ControllerCanvas from './controller/ControllerCanvas.svelte'
	import Screenshots from "./screenshots/Screenshots.svelte"

  let selectedCamera: CameraType | null = null
</script>
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
  </div>
  <div class="w-full">
    {#if selectedCamera}
      <Camera port={selectedCamera.port}/>
    {/if}
  </div>
  <Screenshots />
</main>
<div class="fixed bottom-0 right-0">
  <ControllerCanvas />
</div>