<script lang="ts">
  import Workbench from "./components/Workbench.svelte";
  import WorkbenchElements from "./components/WorkbenchElements.svelte";
  import ElementTooltip from "./components/tooltips/ElementTooltip.svelte";
  import Grid from "./components/Grid.svelte";
  import {
    storesTooltipOpen,
    mousePosition,
    width,
    functionsTooltipOpen,
    clickedElement,
    elementTooltipId,
    showGrid,
  } from "./stores/globals";
  import { elements } from "./stores/elements";
  import { onMount } from "svelte";
  import StoresTooltip from "./components/tooltips/StoresTooltip.svelte";
  import FunctionsTooltip from "./components/tooltips/FunctionsTooltip.svelte";
  import { updateElement } from "./util";

  let ready = false;
  let showToolbar = false;

  const handleEdit = (property, value) => {
    $clickedElement[property] = value;
    $clickedElement = $clickedElement;
  };

  const handleSave = async () => {
    await updateElement($clickedElement);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      console.log("escape");
      showToolbar = !showToolbar;
    }
  };

  onMount(async () => {
    ready = true;
  });
</script>

<svelte:window on:keydown={handleKeyPress} />

{#if ready}
  <main
    on:mousemove={(e) => {
      $mousePosition = { x: e.clientX, y: e.clientY };
    }}
    bind:clientWidth={$width}
  >
    {#if ready && !$showGrid}
      <Workbench />
    {/if}
    {#if ready && showToolbar}
      <div class="toolbar">
        <WorkbenchElements />
      </div>
    {/if}
  </main>
{/if}
<div class="tooltips">
  {#if ready && $storesTooltipOpen}
    <StoresTooltip />
  {/if}
  {#if ready && $functionsTooltipOpen}
    <FunctionsTooltip />
  {/if}
  {#if ready && $elementTooltipId === $clickedElement?._id}
    <ElementTooltip
      element={$clickedElement}
      {handleEdit}
      {handleSave}
      on:delete={() => {
        $elements = $elements.filter((e) => e.id !== $clickedElement.id);
        $elementTooltipId = null;
      }}
    />
  {/if}
</div>

{#if ready && $showGrid}
  <Grid />
{/if}

<style>
  main {
    font-family: "bebas-neue", sans-serif;
  }

  .toolbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: fit-content;
    background: rgba(0, 0, 0, 0.5);
    padding: 10px;
    z-index: 99999;
    border-bottom: 3px solid black;
    display: flex;
    justify-content: center;
  }

  .tooltips {
    display: flex;
    width: calc(100vw);
    background: transparent;
    top: 0px;
    pointer-events: none;
    justify-content: left;
    position: absolute;
    z-index: 99998;
    top: 0px;
    left: 0px;
    height: 100vh;
    width: 100vw;
  }
</style>
