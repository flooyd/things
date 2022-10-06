<script>
  let moving = false;
  let left = 30;
  let top = 30;
  let element = null;

  const move = (e) => {
    if (moving) {
      left > -1 ? (left += e.movementX) : (left = 0);
      top > -1 ? (top += e.movementY) : (top = 0);
    }
  };

  const start = (e) => {
    moving = true;
  };

  const stop = (e) => {
    moving = false;
  };
</script>

<svelte:window on:mouseup={stop} on:mousemove={move} />

<div
  bind:this={element}
  class="draggable"
  on:mousedown={start}
  on:stop={stop}
  style="position: absolute; left: {left}px; top: {top}px;"
>
  <slot />
</div>

<style>
  .draggable {
    cursor: move;
  }
</style>
