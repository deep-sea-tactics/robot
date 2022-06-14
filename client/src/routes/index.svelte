<script lang="ts">
  import Camera from "$lib/camera/Camera.svelte"
  import { cameras, type Camera as CameraType } from "$lib/camera/camera"
	import ControllerCanvas from '$lib/controller/ControllerCanvas.svelte'
	import Screenshots from "$lib/screenshots/Screenshots.svelte"
  import Icon from 'svelte-awesome';
  import gear from 'svelte-awesome/icons/gear';
  import Settings from "$lib/settings/Settings.svelte"
  import { getContext } from 'svelte';
  const { open } = getContext('simple-modal');

  let selectedCamera: CameraType | null = null
</script>
<svelte:window on:keypress={event => {
  if (event.key == "V") {
    if (!selectedCamera) {
      selectedCamera = $cameras[$cameras.length - 1]
      return
    }
    
    selectedCamera = $cameras[
      $cameras.indexOf(selectedCamera) == 0 
        ? ($cameras.length - 1) 
        : $cameras.indexOf(selectedCamera) - 1
      ]
  } else if (event.key == "v") {
    if (!selectedCamera) {
      selectedCamera = $cameras[0];
      return
    }
    
    selectedCamera = $cameras[($cameras.indexOf(selectedCamera) + 1) % $cameras.length]
  }
}}></svelte:window>
<main class="flex flex-row w-screen h-screen">
  <div class="w-1/5 flex flex-col divide-y divide-black">
    {#if $cameras.length === 0}
    <div 
    class="w-full flex-grow p-8 text-center hover:cursor-pointer flex justify-center items-center bg-red-200 hover:bg-red-300 active:bg-red-400 transition-all text-xl"
    on:click={() => open(Settings)}
    >
      No cameras. Add some in the settings.  
    </div>
    {:else}
      {#each $cameras as camera}
        <div 
          class="w-full hover:cursor-pointer flex-grow p-8 text-center flex justify-center items-center bg-lime-200 hover:bg-lime-300 active:bg-lime-400 transition-all text-xl" 
          class:bg-lime-400={selectedCamera == camera}
          class:font-bold={selectedCamera == camera}
          on:click={() => selectedCamera = camera}
        >
          <span>
            {camera.description} ({camera.port})
          </span>
        </div>
      {/each}
    {/if}
    <div class="w-full flex-shrink p-2 flex justify-center items-center bg-gray-300">Press <kbd>V</kbd> to Cycle</div>
  </div>
  <div class="w-full">
    {#if selectedCamera}
      {#key selectedCamera}
        <Camera port={selectedCamera.port}/>
      {/key}
    {:else}
      <p class="flex items-center justify-center w-full h-full text-2xl font-semibold">
        <span>
          No camera selected.<br/>
          Press <kbd>V</kbd> or click to select one.
        </span>
      </p>
    {/if}
  </div>
  <Screenshots />
</main>
<div class="fixed top-0 right-0 m-4" on:click={() => open(Settings)}>
  <Icon data={gear} scale={5} class="hover:rotate-12 transition-all"></Icon>
</div>
<div class="fixed bottom-0 right-0">
  <ControllerCanvas />
</div>