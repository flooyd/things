<script>
  import Element from "./Element.svelte";
  import { getId } from "./util";
</script>

<div id={getId()} class="element" />

<style>
  .element {
    position: relative;
    width: 32px;
    height: 32px;
    border: 1px solid black;
  }
</style>
