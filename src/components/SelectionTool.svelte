<script>
  export let gridRect;
  export let startLocation;
  export let mousePosition;
</script>

<div
  class="selection-tool"
  style="left: {startLocation.x -
    gridRect.x}px; top: {startLocation.y}px; width: {mousePosition.x -
    startLocation.x}px; height: {mousePosition.y - startLocation.y}px;"
/>

<style>
  .selection-tool {
    position: relative;
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.3);
    z-index: 1000;
  }
</style>
