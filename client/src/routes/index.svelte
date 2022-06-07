<script lang="ts">
  import Camera from "$lib/camera/Camera.svelte"
  import { cameras, type Camera as CameraType } from "$lib/camera/camera"
	import ControllerCanvas from '$lib/controller/ControllerCanvas.svelte'
	import Screenshots from "$lib/screenshots/Screenshots.svelte"

  let selectedCamera: CameraType | null = null
</script>
<svelte:window on:keypress={event => {
  if (event.key == "V") {
    if (!selectedCamera) {
      selectedCamera = cameras[cameras.length - 1]
      return
    }
    
    selectedCamera = cameras[
      cameras.indexOf(selectedCamera) == 0 
        ? (cameras.length - 1) 
        : cameras.indexOf(selectedCamera) - 1
      ]
  } else if (event.key == "v") {
    if (!selectedCamera) {
      selectedCamera = cameras[0];
      return
    }
    
    selectedCamera = cameras[(cameras.indexOf(selectedCamera) + 1) % cameras.length]
  }
}}></svelte:window>
<main class="flex flex-row w-screen h-screen">
  <div class="w-1/5 flex flex-col divide-y divide-black">
    {#each cameras as camera}
      <div 
        class="w-full flex-grow p-8 text-center flex justify-center items-center bg-lime-200 hover:bg-lime-300 active:bg-lime-400 transition-all text-xl" 
        class:bg-lime-400={selectedCamera == camera}
        class:font-bold={selectedCamera == camera}
        on:click={() => selectedCamera = camera}
      >
        <span>
          {camera.description} ({camera.port})
        </span>
      </div>
    {/each}
    <div class="w-full flex-shrink p-2 flex justify-center items-center bg-gray-300">Press V to Cycle</div>
  </div>
  <div class="w-full">
    {#if selectedCamera}
      {#key selectedCamera}
        <Camera port={selectedCamera.port}/>
      {/key}
    {:else}
      <p class="flex items-center justify-center w-full h-full text-2xl font-semibold">No camera selected. <br/>Press V or click to select a new one!</p>
    {/if}
  </div>
  <Screenshots />
</main>
<div class="fixed bottom-0 right-0">
  <ControllerCanvas />
</div>