<script lang="ts">
  import Toolbar from "./components/Toolbar.svelte";

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
    showToolbar,
    toolbarOpenStyle,
  } from "./stores/globals";
  import { elements } from "./stores/elements";
  import { onMount } from "svelte";
  import StoresTooltip from "./components/tooltips/StoresTooltip.svelte";
  import FunctionsTooltip from "./components/tooltips/FunctionsTooltip.svelte";
  import { updateElement } from "./util";

  let ready = false;

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
      $showToolbar = !$showToolbar;
    }
  };

  onMount(async () => {
    ready = true;
  });

  const handleClickId = (e) => {
    $elementTooltipId === $clickedElement._id
      ? ($elementTooltipId = null)
      : ($elementTooltipId = $clickedElement._id);
  };

  $: $showToolbar
    ? ($toolbarOpenStyle = "height: calc(100vh - 49px); margin-top: 49px;")
    : ($toolbarOpenStyle = "");
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
    {#if ready && $showToolbar}
      <Toolbar />
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
