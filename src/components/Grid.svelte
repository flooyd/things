<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import {
    clickedElement,
    outArrowClicked,
    inArrowClicked,
    draggableMoving,
    functionMoving,
    dirtyFunctions,
    mouseDownStartedOnArrow,
  } from "../stores/globals";
  import Draggable from "./Draggable.svelte";
  import GridFunction from "./GridFunction.svelte";
  import {
    addConnection,
    fetchFunctionsForElement,
    saveDirtyFunctions,
    getAllConnectionsForElement,
  } from "../util.js";
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

    const connectionsForElement = await getAllConnectionsForElement(
      $clickedElement._id
    );

    if (connectionsForElement.length > 0) {
      $clickedElement.grid.connections = connectionsForElement;
      connectionLocations = getConnectionLocations();
    }

    $clickedElement.grid.connections = connectionsForElement;

    ready = true;
  });

  $: if (element) {
    rect = element.getBoundingClientRect();
  }

  $: if ($inArrowClicked && $outArrowClicked) {
    createConnection();
  }

  const createConnection = async () => {
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
      const createdConnection = await addConnection({
        in: $inArrowClicked,
        out: $outArrowClicked,
        elementId: $clickedElement._id,
      });

      if (createdConnection) {
        $clickedElement.grid.connections.push(createdConnection);
      }

      connectionLocations = getConnectionLocations();
      $clickedElement = $clickedElement;
      $inArrowClicked = null;
      $outArrowClicked = null;
    } else {
      $inArrowClicked = null;
      $outArrowClicked = null;
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

    return connectionLocations;
  };

  const updateSelectionToolProps = (e) => {
    if (!$mouseDownStartedOnArrow) {
      selectionToolStartLocation = {
        x: e.clientX - rect.x,
        y: e.clientY - rect.y,
      };
      selectionToolMousePosition = {
        x: e.clientX - rect.x,
        y: e.clientY - rect.y,
      };
    }
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

  setInterval(() => {
    if ($draggableMoving && $functionMoving) {
      connectionLocations = getConnectionLocations();
    }
  }, 5);

  setInterval(() => {
    if ($dirtyFunctions.length > 0) {
      saveDirtyFunctions($dirtyFunctions);
      $dirtyFunctions = [];
    }
  }, 1000);
</script>

<svelte:window
  on:mousemove={updateMousePosition}
  on:mouseup={(e) => {
    finalizeSelectionTool(e);
    $draggableMoving = null;
    $functionMoving = null;
  }}
/>
{#if ready}
  <div
    class="grid"
    bind:this={element}
    style={"top: 49px; height: calc(100vh - 49px"}
    on:mousedown={(e) => updateSelectionToolProps(e)}
    on:mouseleave={() => {
      selectionToolStartLocation = null;
      selectionToolMousePosition = null;
      $functionMoving = null;
      $draggableMoving = null;
    }}
    transition:fade={{ duration: 75 }}
  >
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
          y1={connection.inArrowLocation.y}
          x2={connection.outArrowLocation.x - 10}
          y2={connection.outArrowLocation.y}
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
    width: 100vw;
    position: absolute;
    top: 0px;
    left: 0px;
    font-size: 13px;
    color: black;
    z-index: 200;
    pointer-events: all;
    flex-grow: 1;
    background-image: linear-gradient(to right, grey 1px, transparent 1px),
      linear-gradient(to bottom, grey 1px, white 1px);
    background-size: 20px 20px;
  }

  svg {
    opacity: 1;
  }
</style>
