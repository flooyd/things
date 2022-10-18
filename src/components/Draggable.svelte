<script>
  import {
    draggableMoving,
    functionMoving,
    mouseDownStartedOnArrow,
  } from "../stores/globals";
  import { addDirtyFunction } from "../util";
  let moving = false;
  export let left = 30;
  export let top = 30;
  let element = null;

  const move = (e) => {
    if (moving && $functionMoving) {
      left > -1 ? (left += e.movementX) : (left = 0);
      top > -1 ? (top += e.movementY) : (top = 0);
    }
  };

  const start = (e) => {
    if (!$mouseDownStartedOnArrow) {
      moving = true;
      $draggableMoving = true;
    }
  };

  const stop = async (e) => {
    if (moving) {
      moving = false;
      await addDirtyFunction($functionMoving);
      $draggableMoving = false;
      $functionMoving = null;
    }
  };
</script>

<div
  bind:this={element}
  class="draggable"
  on:mousedown={start}
  on:mouseup={stop}
  on:mousemove={move}
  style="position: absolute; left: {left}px; top: {top}px;"
>
  <slot />
</div>

<style>
  .draggable {
    cursor: move;
  }
</style>
