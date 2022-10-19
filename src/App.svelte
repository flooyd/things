<script lang="ts">
  import Toolbar from "./components/Toolbar.svelte";

  import Workbench from "./components/Workbench.svelte";
  import ElementTooltip from "./components/tooltips/ElementTooltip.svelte";
  import Grid from "./components/Grid.svelte";
  import GridFunction from "./components/GridFunction.svelte";
  import {
    mousePosition,
    width,
    height,
    functionsTooltipOpen,
    clickedElement,
    elementTooltipId,
    showGrid,
    showToolbar,
    toolbarOpenStyle,
    htmlTooltipOpen,
    gridConnectionLocationsUpdatePending,
    functionMoving,
    windowScrollX,
    windowScrollY,
    variablesStoresTooltipOpen,
  } from "./stores/globals";
  import { elements } from "./stores/elements";
  import { onMount } from "svelte";
  import FunctionsTooltip from "./components/tooltips/FunctionsTooltip.svelte";
  import { updateElement } from "./util";
  import HtmlTooltip from "./components/tooltips/HTMLTooltip.svelte";
  import VariablesStoresTooltip from "./components/tooltips/VariablesStoresTooltip.svelte";

  let ready = false;
  let connectionLocations = [];
  let scrollX = 0;
  let scrollY = 0;

  onMount(async () => {
    ready = true;
  });

  const handleEdit = (property, value) => {
    $clickedElement[property] = value;
    $clickedElement = $clickedElement;
  };

  const handleSave = async () => {
    await updateElement($clickedElement);
    $clickedElement = $clickedElement;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      $showToolbar = !$showToolbar;
    }
  };

  const getConnectionLocations = () => {
    const connectionLocations = [];

    $clickedElement.grid.connections.forEach((connection) => {
      const inArrowLocation =
        $clickedElement.grid.functions.find((f) => f._id === connection.in).rect
          ?.inArrowLocation || null;

      const outArrowLocation =
        $clickedElement.grid.functions.find((f) => f._id === connection.out)
          .rect?.outArrowLocation || null;

      connectionLocations.push({
        inArrowLocation,
        outArrowLocation,
        key: `${connection.in}-${connection.out}`,
      });
    });

    $gridConnectionLocationsUpdatePending = false;
    return connectionLocations;
  };

  $: $showToolbar
    ? ($toolbarOpenStyle = "height: calc(100vh - 49px); margin-top: 49px;")
    : ($toolbarOpenStyle = "");

  $: if ($gridConnectionLocationsUpdatePending) {
    connectionLocations = getConnectionLocations();
  }

  setInterval(() => {
    if ($functionMoving) {
      connectionLocations = getConnectionLocations();
    }
  }, 5);
</script>

<svelte:window on:keydown={handleKeyPress} />

{#if ready}
  <main
    on:mousemove={(e) => {
      $mousePosition = { x: e.clientX, y: e.clientY };
    }}
    bind:clientWidth={$width}
    bind:clientHeight={$height}
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
  {#if ready && $htmlTooltipOpen}
    <HtmlTooltip />
  {/if}
  {#if ready && $functionsTooltipOpen}
    <FunctionsTooltip />
  {/if}
  {#if ready && $variablesStoresTooltipOpen}
    <VariablesStoresTooltip />
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
{#if ready && $clickedElement?.grid?.functions.length > 0 && $showGrid}
  {#each $clickedElement.grid.functions as item}
    <GridFunction gridFunction={item} />
  {/each}
  {#each connectionLocations as connection (connection.key)}
    <svg
      height="5000px"
      width="5000px"
      style="position: absolute; top: 0; left: 0; pointer-events: none;"
      ><line
        x1={connection.inArrowLocation.x}
        y1={connection.inArrowLocation.y}
        x2={connection.outArrowLocation.x + 10}
        y2={connection.outArrowLocation.y}
        stroke="black"
        stroke-width="5"
        stroke-linecap="round"
        stroke-dasharray="2, 2"
      /></svg
    >
  {/each}
{/if}

<style>
  main {
    font-family: "bebas-neue", sans-serif;
    background: white;
  }

  .tooltips {
    display: flex;
    background: transparent;
    top: 0px;
    pointer-events: none;
    justify-content: left;
    position: fixed;
    z-index: 99998;
    top: 0px;
    left: 0px;
    height: 100vh;
    width: 100vw;
  }
</style>
