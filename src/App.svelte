<script lang="ts">
  import Toolbar from "./components/Toolbar.svelte";
  import Workbench from "./components/Workbench.svelte";
  import ElementTooltip from "./components/tooltips/ElementTooltip.svelte";
  import Grid from "./components/Grid.svelte";
  import GridFunction from "./components/GridFunction.svelte";
  import ContextMenu from "./components/ContextMenu.svelte";
  import {
    mousePosition,
    width,
    height,
    functionsTooltipOpen,
    clickedElement,
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
    contextElement,
    mimic,
  } from "./stores/globals";
  import { elements, elementUpdated } from "./stores/elements";
  import { onMount } from "svelte";
  import FunctionsTooltip from "./components/tooltips/FunctionsTooltip.svelte";
  import { epicFunctions, getVariablesForElement, updateElement } from "./util";
  import HtmlTooltip from "./components/tooltips/HTMLTooltip.svelte";
  import VariablesStoresTooltip from "./components/tooltips/VariablesStoresTooltip.svelte";
  import { fade, fly } from "svelte/transition";

  let ready = false;
  let connectionLocations = [];
  let dirtyElements = [];
  let second = 0;

  onMount(async () => {
    ready = true;
  });

  const handleEdit = (property, value, elementFromTree) => {
    if (value.includes(";")) {
      value = value.replace(";", "");
      return;
    }
    second = 5;
    property = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    $clickedElement[property] = value;
    if (dirtyElements.indexOf($clickedElement._id) === -1) {
      dirtyElements.push($clickedElement._id);
    }
    dirtyElements = dirtyElements;
    $elementUpdated++;
  };

  const handleSave = async () => {
    dirtyElements.forEach(async (elementId) => {
      const element = $elements.find((element) => element._id === elementId);
      await updateElement(element);
    });
    dirtyElements = [];
  };

  setInterval(() => {
    if (second === 0) return;
    second--;
  }, 1000);

  $: if (second === 0) {
    handleSave();
  }

  const handleKeyPress = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      $showToolbar = !$showToolbar;
    }
  };

  const getConnectionLocations = () => {
    const connectionLocations = [];
    let containingObject = $mimic ? $mimic : $clickedElement;
    containingObject.grid.connections.forEach((connection) => {
      const inArrowLocation =
        containingObject.grid.functions.find((f) => f._id === connection.in)
          .rect.inArrowLocation || null;

      const outArrowLocation =
        containingObject.grid.functions.find((f) => f._id === connection.out)
          .rect.outArrowLocation || null;

      //get number of outpoints for in function
      const inFunction = containingObject.grid.functions.find(
        (f) => f._id === connection.in
      );

      const numOutputs = epicFunctions[inFunction?.name]?.outputs.count || 0;

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

  $: if (!$showGrid && $clickedElement) {
    $clickedElement.grid = null;
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
      <Workbench {handleEdit} />
    {/if}
    {#if ready && $showToolbar}
      <div transition:fade={{ duration: 150 }}>
        <Toolbar />
      </div>
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
</div>
{#if second !== 0}
  <div
    in:fly={{ duration: 200, y: 3000 }}
    out:fade={{ duration: 200 }}
    class="save-indicator"
  >
    <!-- <p>Save in {}</p> -->
    <!-- Saving in {second} second(s)... -->
    Saving in {second}
    {second > 1 ? "seconds" : "second"}...
  </div>
{/if}
{#if ready && $contextElement}
  <ContextMenu />
{/if}

{#if ready && $showGrid}
  <Grid />
{/if}
{#if ready && $clickedElement?.grid?.functions?.length > 0 && $showGrid}
  {#each $clickedElement.grid.functions as item (item._id)}
    <div>
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
{#if $contextElement}
  <div>
    <ContextMenu />
  </div>
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

  .save-indicator {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: fit-content;
    background: #333;
    display: flex;
    justify-content: left;
    align-items: center;
    color: white;
    box-sizing: border-box;
    font-size: 20px;
    z-index: 99999;
    padding: 13px;
    border-radius: 90px;
  }
</style>
