<script>
  import { onMount, afterUpdate } from "svelte";
  import { tick } from "svelte";
  import {
    storesTooltipOpen,
    functionsTooltipOpen,
    clickedElement,
    outArrowClicked,
    inArrowClicked,
    draggableMoving,
    functionMoving,
  } from "../stores/globals";
  import Draggable from "./Draggable.svelte";
  import GridFunction from "./GridFunction.svelte";
  import { fetchFunctionsForElement, removeAllFunctions } from "../util.js";

  let element = null;
  let rect = null;
  let connections = [];
  let connectionLocations = [];
  let ready = false;

  onMount(async () => {
    $clickedElement.grid = {
      functions: await fetchFunctionsForElement($clickedElement._id),
      connections: [],
    };
    ready = true;
  });

  $: if (element) {
    rect = element.getBoundingClientRect();
  }

  $: if ($inArrowClicked && $outArrowClicked) {
    connections.push({
      in: $inArrowClicked,
      out: $outArrowClicked,
    });
    connections = connections;
    connectionLocations = getConnectionLocations();
    $inArrowClicked = null;
    $outArrowClicked = null;
  }

  const getConnectionLocations = () => {
    const connectionLocations = [];

    connections.forEach((connection) => {
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
    return connectionLocations;
  };

  setInterval(() => {
    if ($draggableMoving && $functionMoving) {
      connectionLocations = getConnectionLocations();
    }
  }, 25);

  setInterval(() => {
    connectionLocations = getConnectionLocations();
  }, 1000);
</script>

{#if ready}
  <div class="grid" bind:this={element}>
    <div class="toolbar">
      <div class="id">
        {$clickedElement.name
          ? $clickedElement._id + " - " + $clickedElement.name
          : $clickedElement._id}
      </div>
      <button
        on:click={() => ($storesTooltipOpen = !$storesTooltipOpen)}
        class="blueButton">stores</button
      >
      <button
        on:click={() => ($functionsTooltipOpen = !$functionsTooltipOpen)}
        class="blueButton">functions</button
      >
    </div>
    {#if rect}
      {#each $clickedElement.grid.functions as item}
        <Draggable>
          <GridFunction gridRect={rect} gridFunction={item} />
        </Draggable>
      {/each}
    {/if}
    {#each connectionLocations as connection (connection.key)}
      <svg
        width="100%"
        height="100%"
        style="position: absolute; top: 0; left: 0; pointer-events: none;"
        ><line
          x1={connection.inArrowLocation.x + 10}
          y1={connection.inArrowLocation.y + 14}
          x2={connection.outArrowLocation.x - 10}
          y2={connection.outArrowLocation.y + 14}
          stroke="black"
          stroke-width="3"
        /></svg
      >
    {/each}
  </div>
{/if}

<style>
  .grid {
    height: 100vh;
    font-size: 13px;
    overflow-y: auto;
    overflow-x: auto;
    color: black;
    z-index: 200;
    pointer-events: all;
    flex-grow: 1;
    background-image: linear-gradient(to right, grey 1px, transparent 1px),
      linear-gradient(to bottom, grey 1px, white 1px);
    background-size: 20px 20px;
    position: relative;
  }

  .toolbar {
    width: 100%;
    height: 30px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 13px;
    pointer-events: none;
  }

  .toolbar button {
    margin-right: 13px;
    pointer-events: all;
  }

  .id {
    margin-right: 13px;
    font-size: 16px;
    font-weight: bold;
    padding: 5px 8px;
    border-radius: 5px;
    background: white;
    border: 2px solid black;
  }
</style>
