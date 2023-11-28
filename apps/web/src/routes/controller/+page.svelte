<script lang="ts">
  import { onMount } from "svelte";
  import type { ControllerData } from "robot/dist/controller";
  let gamepad: Gamepad | null;

  let output: ControllerData;

  onMount(() => {
    window.addEventListener("gamepadconnected", (e) => {
      gamepad = navigator.getGamepads()[e.gamepad.index];
      requestAnimationFrame(getInput)
    })
  })

  function getInput() {
    gamepad = navigator.getGamepads()[0];
    if (!gamepad) return
    output = {
      buttons: {
        trigger: gamepad.buttons[0].pressed,
        side_grip: gamepad.buttons[1].pressed,
        joystick: {
          lowerLeft: gamepad.buttons[2].pressed,
          lowerRight: gamepad.buttons[3].pressed,
          upperLeft: gamepad.buttons[4].pressed,
          upperRight: gamepad.buttons[5].pressed,
        },
        grid: {
          topLeft: gamepad.buttons[6].pressed,
          topRight: gamepad.buttons[7].pressed,
          middleLeft: gamepad.buttons[8].pressed,
          middleRight: gamepad.buttons[9].pressed,
          bottomLeft: gamepad.buttons[10].pressed,
          bottomRight: gamepad.buttons[11].pressed,
        }
      },
      position: {
        x: gamepad.axes[0],
        y: gamepad.axes[1],
      },
      yaw: gamepad.axes[5],
      throttle: gamepad.axes[6],  
      view: gamepad.axes[9]
    }

    requestAnimationFrame(getInput)
  }
</script>

<h1>bleh</h1>
<pre>{JSON.stringify(output,null,2)}</pre>