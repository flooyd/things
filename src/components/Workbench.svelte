<script lang="ts">
  import WorkbenchElements from "./WorkbenchElements.svelte";
  import { elements } from "../stores/elements";
  import { okay } from "../stores/settings";
  import Element from "./elements/Element.svelte";

  let collectionName = "Sample Collection";
  let heightOffset = 241;

  $: $okay ? (heightOffset = 167) : (heightOffset = 241);

  const getElement = (type) => {
    //switch on type
  };

  $elements.push({
    type: "div",
    style: {},
    content: "",
  });
</script>

<div class="workbench" style="height: calc(100vh - {heightOffset}px);">
  <div class="collectionName">
    <h1>{collectionName}</h1>
  </div>
  <div class="toolbar">
    <WorkbenchElements />
  </div>
  <div class="view">
    {#each $elements as element}
      <Element {element} />
    {/each}
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

  .view {
    margin: 0px -20px;
    margin-top: 20px;
    height: calc(100% - 146px);
    overflow-y: auto;
    background: blue;
  }
</style>
