<script lang="ts">
  import { onMount } from "svelte";
  let gamepad: Gamepad | null;

  let output;

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
      trigger: gamepad.buttons[0].pressed,
      side_button: gamepad.buttons[1].pressed,
      lower_left_button: gamepad.buttons[2].pressed,
      lower_right_button: gamepad.buttons[3].pressed,
      upper_left_button: gamepad.buttons[4].pressed,
      upper_right_button: gamepad.buttons[5].pressed,
      grid_top_left: gamepad.buttons[6].pressed,
      grid_top_right: gamepad.buttons[7].pressed,
      grid_middle_left: gamepad.buttons[8].pressed,
      grid_middle_right: gamepad.buttons[9].pressed,
      grid_bottom_left: gamepad.buttons[10].pressed,
      grid_bottom_right: gamepad.buttons[11].pressed,
      main_axis_horizontal: gamepad.axes[0],
      main_axis_vertical: gamepad.axes[1],
      main_axis_yaw: gamepad.axes[5],
      throttle: gamepad.axes[6],  
      center_axis: gamepad.axes[9]
    }
    console.log(output)
    requestAnimationFrame(getInput)
  }
</script>

<h1>bleh</h1>
<pre>{JSON.stringify(output,null,2)}</pre>