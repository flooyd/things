<script>
  import { getId } from "./util";
  export let style = {};

  let id = getId();
</script>

<div id class="element" style="background: {style.background}" />

<style>
  .element {
    position: relative;
    width: 100px;
    height: 100px;
    border: 1px solid black;
  }
</style>
