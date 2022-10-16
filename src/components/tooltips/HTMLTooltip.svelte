<script>
  import { onMount } from "svelte";
  import { addElement } from "../../util";
</script>

<div class="htmlTooltip" />

<style>
  .htmlTooltip {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 400px;
    height: calc(100vh - 30px);
    background: white;
    font-size: 13px;
    padding: 16px;
    overflow-y: auto;
    color: black;
    z-index: 200;
    overflow-x: auto;
    pointer-events: all;
  }
</style>
