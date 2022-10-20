<script>
  import { onMount, tick } from "svelte";
  import { fade } from "svelte/transition";
  import {
    clickedElement,
    outArrowClicked,
    inArrowClicked,
    functionMoving,
    mouseDownStartedOnArrow,
    gridConnectionLocationsUpdatePending,
  } from "../stores/globals";
  import {
    addConnection,
    fetchFunctionsForElement,
    getAllConnectionsForElement,
  } from "../util.js";
  import SelectionTool from "./SelectionTool.svelte";

  let element = null;
  let rect = null;
  let ready = false;
  let selectionToolStartLocation = null;
  let selectionToolMousePosition = null;

  onMount(async () => {
    if (!$clickedElement) return;
    let functionsForElement = await fetchFunctionsForElement(
      $clickedElement._id
    );
    $clickedElement.grid = [];
    $clickedElement.grid.connections = [];
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
    }

    $clickedElement.grid.connections = connectionsForElement;
    $gridConnectionLocationsUpdatePending = true;
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

      $gridConnectionLocationsUpdatePending = true;
      await tick();
      $clickedElement = $clickedElement;
      $inArrowClicked = null;
      $outArrowClicked = null;
    } else {
      $inArrowClicked = null;
      $outArrowClicked = null;
    }
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
</script>

<svelte:window
  on:mousemove={updateMousePosition}
  on:mouseup={(e) => {
    finalizeSelectionTool(e);
  }}
/>
{#if !$clickedElement}
  <div class="noElement">
    <div class="title">No Element Selected</div>
    <div class="hideGrid">
      Click Hide Grid above and select an element by double clicking it.
    </div>
  </div>
{/if}
{#if ready}
  <div
    class="grid"
    bind:this={element}
    on:mousedown={(e) => updateSelectionToolProps(e)}
    on:mouseleave={() => {
      selectionToolStartLocation = null;
      selectionToolMousePosition = null;
      $functionMoving = null;
    }}
    transition:fade={{ duration: 75 }}
  >
    {#if selectionToolStartLocation && selectionToolMousePosition && !$functionMoving}
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
    height: 5000px;
    width: 5000px;
    position: absolute;
    top: 0px;
    left: 0px;
    font-size: 13px;
    color: black;
    pointer-events: all;
    flex-grow: 1;
    background-image: linear-gradient(to right, grey 1px, transparent 1px),
      linear-gradient(to bottom, grey 1px, white 1px);
    background-size: 20px 20px;
    white-space: nowrap;
  }

  .noElement {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    font-size: 20px;
    color: black;
    line-height: 1.4;
  }

  .title {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 20px;
  }
</style>
