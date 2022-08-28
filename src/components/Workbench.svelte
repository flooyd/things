<script>
  import WorkbenchElements from "./WorkbenchElements.svelte";
  import { okay } from "../stores/settings";

  let collectionName = "Sample Collection";
  let heightOffset = 241;

  $: $okay ? (heightOffset = 167) : (heightOffset = 241);
</script>

<div class="workbench" style="height: calc(100vh - {heightOffset}px);">
  <div class="collectionName">
    <h1>{collectionName}</h1>
  </div>
  <div class="toolbar">
    <WorkbenchElements />
  </div>
</div>

<style>
  .workbench {
    background: var(--cultured);
    padding: 20px;
    margin: 0px 0px;
    color: black;
  }

  .collectionName {
    font-size: 31px;
    margin-bottom: 13px;
    color: var(--oxford-blue);
  }

  .toolbar {
    background: var(--shadow-blue);
    height: 31px;
    border-radius: 4px;
    border: 3px solid var(--oxford-blue);
    display: flex;
    align-items: center;
    justify-content: left;
    gap: 13px;
    padding: 10px 13px;
  }
</style>
