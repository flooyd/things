<script>
  import { getId } from "./util";
  export let style = {};

  let id = getId();
</script>

<div
  id
  class="element"
  style="background: {style.background}; width: {style.width}px; height: {style.height}px"
/>

<style>
  .element {
    border: 1px solid black;
  }
</style>
