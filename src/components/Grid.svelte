<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import {
    storesTooltipOpen,
    functionsTooltipOpen,
    clickedElement,
    outArrowClicked,
    inArrowClicked,
    draggableMoving,
    functionMoving,
    elementTooltipId,
    dirtyFunctions,
  } from "../stores/globals";
  import Draggable from "./Draggable.svelte";
  import GridFunction from "./GridFunction.svelte";
  import { fetchFunctionsForElement, saveDirtyFunctions } from "../util.js";
  import SelectionTool from "./SelectionTool.svelte";

  let element = null;
  let rect = null;
  let connectionLocations = [];
  let ready = false;
  let selectionToolStartLocation = null;
  let selectionToolMousePosition = null;

  onMount(async () => {
    let functionsForElement = await fetchFunctionsForElement(
      $clickedElement._id
    );
    $clickedElement.grid = [];
    $clickedElement.grid.connections = [];
    $dirtyFunctions = [];
    functionsForElement = functionsForElement.map((func) => {
      return {
        blah: "5",
        name: func.name,
        _id: func._id,
        rect: {
          x: func.rectX,
          y: func.rectY,
          inArrowLocation: {
            x: func.inArrowX,
            y: func.inArrowYLocations[0],
          },
          outArrowLocation: {
            x: func.outArrowX,
            y: func.outArrowYLocations[0],
          },
        },
      };
    });

    $clickedElement.grid.functions = functionsForElement;
    ready = true;
  });

  $: if (element) {
    rect = element.getBoundingClientRect();
  }

  $: if ($inArrowClicked && $outArrowClicked) {
    //check if connection exists
    let connectionExists = false;
    for (let i = 0; i < $clickedElement.grid.connections.length; i++) {
      if (
        $clickedElement.grid.connections[i].in === $inArrowClicked &&
        $clickedElement.grid.connections[i].out === $outArrowClicked
      ) {
        connectionExists = true;
        break;
      }
    }

    if (!connectionExists) {
      $clickedElement.grid.connections.push({
        in: $inArrowClicked,
        out: $outArrowClicked,
        elementId: $clickedElement._id,
      });

      connectionLocations = getConnectionLocations();
      $clickedElement = $clickedElement;
      $inArrowClicked = null;
      $outArrowClicked = null;
    } else {
      $inArrowClicked = null;
      $outArrowClicked = null;
    }
  }

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
    return connectionLocations;
  };

  const updateSelectionToolProps = (e) => {
    selectionToolStartLocation = {
      x: e.clientX,
      y: e.clientY,
    };
    selectionToolMousePosition = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const updateMousePosition = (e) => {
    selectionToolMousePosition = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const finalizeSelectionTool = () => {
    selectionToolStartLocation = null;
    selectionToolMousePosition = null;
  };

  const handleClickId = (e) => {
    $elementTooltipId === $clickedElement._id
      ? ($elementTooltipId = null)
      : ($elementTooltipId = $clickedElement._id);
  };

  setInterval(() => {
    if ($draggableMoving && $functionMoving) {
      connectionLocations = getConnectionLocations();
    }
  }, 25);

  setInterval(() => {
    connectionLocations = getConnectionLocations();
  }, 1000);

  setInterval(() => {
    rect = element.getBoundingClientRect();
  }, 1000);

  setInterval(() => {
    if ($dirtyFunctions.length > 0) {
      saveDirtyFunctions($dirtyFunctions);
      $dirtyFunctions = [];
    }
  }, 1000);
</script>

<svelte:window
  on:mousemove={updateMousePosition}
  on:mouseup={(e) => finalizeSelectionTool(e)}
/>
{#if ready}
  <div
    class="grid"
    bind:this={element}
    on:mousedown={(e) => updateSelectionToolProps(e)}
    transition:fade={{ duration: 75 }}
  >
    <div class="toolbar">
      <button
        class="id blueButton"
        on:click={() => {
          handleClickId();
        }}
      >
        {$clickedElement.name
          ? $clickedElement._id + " - " + $clickedElement.name
          : $clickedElement._id}
      </button>
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
        <Draggable top={item.rect.y} left={item.rect.x}>
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
          stroke-width="5"
          stroke-linecap="round"
          stroke-dasharray="2, 2"
        /></svg
      >
    {/each}
    {#if selectionToolStartLocation && selectionToolMousePosition && !$draggableMoving}
      <SelectionTool
        gridRect={rect}
        startLocation={selectionToolStartLocation}
        mousePosition={selectionToolMousePosition}
      />
    {/if}
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
    z-index: 99999;
  }

  svg {
    opacity: 0.9;
    color: blue;
  }
</style>
