<script lang="ts">
  import type { ControllerData } from "robot/dist/controller";

  const defaultData: ControllerData = {
    position: {
      x: 0,
      y: 0
    },
    yaw: 0,
    throttle: 50,
    view: 0,
    buttons: {
      trigger: false,
      side_grip: false,
      joystick: {
        lowerLeft: false,
        lowerRight: false,
        upperLeft: false,
        upperRight: false
      },
      grid: {
        topLeft: false,
        topRight: false,
        middleLeft: false,
        middleRight: false,
        bottomLeft: false,
        bottomRight: false
      }
    }
  };

  export let output: ControllerData = structuredClone(defaultData);

  let pressedKeys: Set<string> = new Set();

  const mapping: Record<string, () => void> = {
    "w": () => output.position.y = 1,
    "s": () => output.position.y = -1,
    "a": () => output.position.x = -1,
    "d": () => output.position.x = 1,
  }
  
  function update() {
    output = structuredClone(defaultData);
    for (const key of pressedKeys) {
      mapping[key]?.()
    }
  }

  function keydownEvent(event: KeyboardEvent) {
    pressedKeys.add(event.key);
    update();
  }

  function keyupEvent(event: KeyboardEvent) {
    pressedKeys.delete(event.key);
    update();
  }
</script>

<svelte:window
  on:keydown={keydownEvent}
  on:keyup={keyupEvent}
></svelte:window>
