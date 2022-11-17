<script>
  export let gridRect;
  export let startLocation;
  export let mousePosition;

  let selectionRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  let selectionRectStyle = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };

  $: if (startLocation) {
    selectionRect = {
      x: Math.min(startLocation.x, mousePosition.x),
      y: Math.min(startLocation.y, mousePosition.y),
      width: Math.abs(startLocation.x - mousePosition.x),
      height: Math.abs(startLocation.y - mousePosition.y),
    };

    selectionRectStyle = {
      left: selectionRect.x - gridRect.x,
      top: selectionRect.y - gridRect.y,
      width: selectionRect.width,
      height: selectionRect.height,
    };
  }
</script>

<!-- apply selectionRectStyle using string literal -->
<div
  class="selection-tool"
  style={`left: ${selectionRectStyle.left}px; top: ${selectionRectStyle.top}px;
width: ${selectionRectStyle.width}px; height: ${selectionRectStyle.height}px; `}
/>

<style>
  .selection-tool {
    position: relative;
    /* rgba for orange with .5 alpha */
    background-color: rgba(255, 165, 0, 0.33);
    border: 1px solid rgba(0, 0, 0, 0.3);
    z-index: 9000;
  }
</style>
