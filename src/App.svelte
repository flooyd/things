<script lang="ts">
  import Toolbar from "./components/Toolbar.svelte";
  import Workbench from "./components/Workbench.svelte";
  import Grid from "./components/Grid.svelte";
  import GridFunction from "./components/GridFunction.svelte";
  import ContextMenu from "./components/ContextMenu.svelte";
  import {
    mousePosition,
    width,
    height,
    functionsModalOpen,
    elementOnTheFrontBurner,
    componentOnTheFrontBurner,
    showGrid,
    showToolbar,
    toolbarOpenStyle,
    htmlModalOpen,
    gridConnectionLocationsUpdatePending,
    functionMoving,
    variablesStoresModalOpen,
    windowScrollX,
    windowScrollY,
    variablesFetched,
    variablesStore,
    contextElement,
  } from "./stores/globals";
  import { elements, elementUpdated, visualizeDOM } from "./stores/elements";
  import { onMount } from "svelte";
  import FunctionsModal from "./components/modals/FunctionsModal.svelte";
  import {
    epicFunctions,
    getVariablesForComponent,
    randInRange,
    updateElement,
  } from "./util";
  import HtmlModal from "./components/modals/HTMLModal.svelte";
  import VariablesStoresModal from "./components/modals/VariablesStoresModal.svelte";
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
    $elementOnTheFrontBurner[property] = value;
    if (dirtyElements.indexOf($elementOnTheFrontBurner._id) === -1) {
      dirtyElements.push($elementOnTheFrontBurner._id);
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
    console.log($componentOnTheFrontBurner);
    const connectionLocations = [];
    $componentOnTheFrontBurner.programmingGrid.connections.forEach(
      (connection) => {
        const inArrowLocation =
          $componentOnTheFrontBurner.programmingGrid.functions.find(
            (f) => f._id === connection.in
          ).rect.inArrowLocation || null;

        const outArrowLocation =
          $componentOnTheFrontBurner.programmingGrid.functions.find(
            (f) => f._id === connection.out
          ).rect.outArrowLocation || null;

        //get number of outpoints for in function
        const inFunction =
          $componentOnTheFrontBurner.programmingGrid.functions.find(
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
      }
    );

    $gridConnectionLocationsUpdatePending++;
    return connectionLocations;
  };

  const getVariables = async () => {
    $variablesStore = await getVariablesForComponent(
      $componentOnTheFrontBurner.componentName
    );
  };

  $: $showToolbar
    ? ($toolbarOpenStyle = "height: calc(100vh - 49px); margin-top: 49px;")
    : ($toolbarOpenStyle = "");

  $: if ($gridConnectionLocationsUpdatePending) {
    connectionLocations = getConnectionLocations();
  }

  $: if ($componentOnTheFrontBurner && !$variablesFetched) {
    console.log("component on the front burner", $componentOnTheFrontBurner);
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
      <Workbench {handleEdit} />
    {/if}
    {#if ready && $showToolbar}
      <div transition:fade={{ duration: 150 }}>
        <Toolbar />
      </div>
    {/if}
  </main>
{/if}
<div class="modals">
  {#if ready && $htmlModalOpen}
    <HtmlModal />
  {/if}
  {#if ready && $functionsModalOpen}
    <FunctionsModal />
  {/if}
  {#if ready && $variablesStoresModalOpen}
    <VariablesStoresModal />
  {/if}
</div>
{#if second !== 0}
  <div
    in:fly={{ duration: 200, y: 3000 }}
    out:fade={{ duration: 200 }}
    class="save-indicator"
  >
    Saving in {second}
    {second > 1 ? "seconds" : "second"}...
  </div>
{/if}
{#if ready && $contextElement}
  <ContextMenu />
{/if}

{#if ready && $showGrid}
  <Grid />
  {#if $componentOnTheFrontBurner?.programmingGrid?.functions?.length > 0 && $showGrid}
    {#each $componentOnTheFrontBurner.programmingGrid.functions as item (item._id)}
      <div>
        <GridFunction gridFunction={item} />
      </div>
    {/each}
    {#each connectionLocations as connection (connection.key)}
      <svg
        in:fly={{
          duration: 250,
          x: randInRange(-5000, 5000),
          y: randInRange(-5000, 5000),
        }}
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

  .modals {
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
