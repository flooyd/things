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
    variablesStoresTooltipOpen,
    windowScrollX,
    windowScrollY,
    variablesFetched,
    variablesStore,
  } from "./stores/globals";
  import { elements } from "./stores/elements";
  import { onMount } from "svelte";
  import FunctionsTooltip from "./components/tooltips/FunctionsTooltip.svelte";
  import {
    functionOutputs,
    getVariablesForElement,
    updateElement,
  } from "./util";
  import HtmlTooltip from "./components/tooltips/HTMLTooltip.svelte";
  import VariablesStoresTooltip from "./components/tooltips/VariablesStoresTooltip.svelte";
  import { fade } from "svelte/transition";

  let ready = false;
  let connectionLocations = [];

  $: console.log($clickedElement);

  onMount(async () => {
    ready = true;
  });

  const handleEdit = (property, value) => {
    $clickedElement[property] = value;
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

  const getConnectionLocations = () => {
    const connectionLocations = [];

    console.log($clickedElement.grid.connections);

    $clickedElement.grid.connections.forEach((connection) => {
      const inArrowLocation =
        $clickedElement.grid.functions.find((f) => f._id === connection.in).rect
          .inArrowLocation || null;

      const outArrowLocation =
        $clickedElement.grid.functions.find((f) => f._id === connection.out)
          .rect.outArrowLocation || null;

      //get number of outpoints for in function
      const inFunction = $clickedElement.grid.functions.find(
        (f) => f._id === connection.in
      );

      const numOutputs = functionOutputs[inFunction?.name]?.count || 0;

      connectionLocations.push({
        inArrowLocation,
        outArrowLocation,
        isVariable: connection.outVariableId ? true : false,
        inputIndex: connection.inputIndex ? connection.inputIndex : null,
        outputIndex: connection.outputIndex ? connection.outputIndex : null,
        numOutputs,
        key: `${connection.in}-${connection.out}-${connection.inputIndex}`,
      });
    });

    $gridConnectionLocationsUpdatePending = false;
    return connectionLocations;
  };

  const getVariables = async () => {
    const elementId = $clickedElement._id;
    $variablesStore = await getVariablesForElement(elementId);
  };

  $: $showToolbar
    ? ($toolbarOpenStyle = "height: calc(100vh - 49px); margin-top: 49px;")
    : ($toolbarOpenStyle = "");

  $: if ($gridConnectionLocationsUpdatePending) {
    connectionLocations = getConnectionLocations();
  }

  $: if ($clickedElement && !$variablesFetched) {
    getVariables();
    $variablesFetched = true;
  }

  setInterval(() => {
    if ($functionMoving) {
      connectionLocations = getConnectionLocations();
    }
  }, 5);
</script>

<svelte:window
  on:keydown={handleKeyPress}
  on:mousemove={(e) => {
    $mousePosition = {
      x: e.clientX + $windowScrollX,
      y: e.clientY + $windowScrollY,
    };
  }}
  on:scroll={(e) => {
    $windowScrollX = window.scrollX;
    $windowScrollY = window.scrollY;
  }}
/>

{#if ready}
  <main bind:clientWidth={$width} bind:clientHeight={$height}>
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
  {#each $clickedElement.grid.functions as item (item._id)}
    <div out:fade={{ duration: 100 }}>
      <GridFunction gridFunction={item} />
    </div>
  {/each}
  {#each connectionLocations as connection (connection.key)}
    <svg
      transition:fade={{ duration: 100 }}
      height="5000px"
      width="5000px"
      style="position: absolute; top: 0; left: 0; pointer-events: none;"
      ><line
        x1={connection.inArrowLocation.x}
        y1={connection.inputIndex
          ? connection.inArrowLocation.y +
            37 * connection.inputIndex +
            connection.numOutputs * 37
          : connection.inArrowLocation.y}
        x2={connection.outArrowLocation.x}
        y2={connection.isVariable
          ? connection.outArrowLocation.y + 37
          : connection.outputIndex
          ? connection.outArrowLocation.y + 37 * connection.outputIndex
          : connection.outArrowLocation.y}
        stroke={connection.outputIndex
          ? "grey"
          : connection.inputIndex || connection.isVariable
          ? "orange"
          : "black"}
        stroke-width="5"
        stroke-linecap="round"
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
