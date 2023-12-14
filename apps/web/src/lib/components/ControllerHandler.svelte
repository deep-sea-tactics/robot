<script lang="ts">
  import { Canvas, Layer, type Render } from 'svelte-canvas';
  import Controller from './handlers/Controller.svelte';
  import Keyboard from './handlers/Keyboard.svelte';
  import type { ControllerData } from 'robot/dist/controller';

  let controller: Gamepad;

  let controllerOutput: ControllerData;
  let keyboardOutput: ControllerData

  $: output = controller ? controllerOutput : keyboardOutput;

  const render: Render = ({ context, width, height }) => {
    if (!output) return;

    context.font = `${width / 10}px sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = 'tomato';
    context.fillText(output.position.x.toString(), width / 2, height / 2);
  };
</script>

<Controller bind:controller bind:output={controllerOutput} />
<Keyboard bind:output={keyboardOutput} />

<Canvas autoplay>
  <Layer {render} />
</Canvas>