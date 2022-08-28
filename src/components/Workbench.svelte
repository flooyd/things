<script lang="ts">
  import WorkbenchElements from "./WorkbenchElements.svelte";
  import { elements } from "../stores/elements";
  import { okay } from "../stores/settings";
  import Element from "./elements/Element.svelte";
  import { onMount } from "svelte";
  import randomHexColor from "random-hex-color";

  let collectionName = "Sample Collection";
  let heightOffset = 241;

  $: $okay ? (heightOffset = 167) : (heightOffset = 241);

  const getElement = (type) => {
    //switch on type
  };

  const populateElements = () => {
    for (let i = 0; i < 1000; i++) {
      $elements.push({ type: "div", style: { background: randomHexColor() } });
    }
    $elements = $elements;
  };

  onMount(() => {
    populateElements();
    setInterval(() => {
      $elements = [];
      populateElements();
    }, 50);
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
    margin-top: 20px;
    background: lightgreen;
    height: calc(100% - 146px);
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    overflow-y: auto;
  }
</style>
