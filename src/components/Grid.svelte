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
    outVariableClicked,
    inVariableClicked,
    outputClicked,
    usingSelectionTool,
    elementUpdated,
  } from "../stores/globals";
  import {
    addConnection,
    deleteConnectionById,
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
        isVariable: func.isVariable,
        variableId: func.variableId,
        rect: {
          x: func.rectX,
          y: func.rectY,
          inArrowLocation: {
            x: func.inArrowX,
            y: 37,
          },
          outArrowLocation: {
            x: func.outArrowX,
            y: 37,
          },
          variableInCircleLocation: {
            x: null, //func.isVariable ? func.variableInCircleX : null,
            y: null, //func.isVariable ? func.variableInCircleY : null,
          },
          variableOutCircleLocation: {
            x: null, //func.isVariable ? func.variableOutCircleX : null,
            y: null, //func.isVariable ? func.variableOutCircleY : null
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

  $: if (element && ready) {
    rect = element.getBoundingClientRect();
  }

  $: if ($inArrowClicked && $outArrowClicked) {
    createConnection();
  }

  $: if ($inVariableClicked && $outVariableClicked) {
    createVariableConnection();
  }

  $: if ($outputClicked && $inVariableClicked) {
    createOutputConnection();
  }

  const removeOverlappingVariableConnection = async () => {
    let existingConnectionDeleted = null;
    for (let i = 0; i < $clickedElement.grid.connections.length; i++) {
      if (
        $clickedElement.grid.connections[i].in ===
          $inVariableClicked.functionId &&
        $clickedElement.grid.connections[i].inputIndex ===
          $inVariableClicked.inputIndex
      ) {
        await deleteConnectionById($clickedElement.grid.connections[i]._id);
        existingConnectionDeleted = $clickedElement.grid.connections[i]._id;
      }

      if (existingConnectionDeleted) {
        $clickedElement.grid.connections =
          $clickedElement.grid.connections.filter(
            (conn) => conn._id != existingConnectionDeleted
          );
      }
    }
  };

  const createOutputConnection = async () => {
    let connectionExists = false;
    for (let i = 0; i < $clickedElement.grid.connections.length; i++) {
      if (
        $clickedElement.grid.connections[i].outputIndex ===
          $outputClicked.outputIndex &&
        $clickedElement.grid.connections[i].in ===
          $inVariableClicked.functionId &&
        $clickedElement.grid.connections[i].inputIndex ===
          $inVariableClicked.inputIndex &&
        $clickedElement.grid.connections[i].out === $outputClicked.functionId
      ) {
        connectionExists = true;
        break;
      }
    }

    if (!connectionExists) {
      await removeOverlappingVariableConnection();

      const connection = {
        outputIndex: $outputClicked.outputIndex,
        in: $inVariableClicked.functionId,
        inputIndex: $inVariableClicked.inputIndex,
        out: $outputClicked.functionId,
        elementId: $clickedElement._id,
      };

      const createdConnection = await addConnection(connection);
      if (createdConnection) {
        $clickedElement.grid.connections.push(createdConnection);
        $gridConnectionLocationsUpdatePending = true;
      }

      $outputClicked = null;
      $inVariableClicked = null;
    }
  };

  const createVariableConnection = async () => {
    let connectionExists = false;
    for (let i = 0; i < $clickedElement.grid.connections.length; i++) {
      if (
        $clickedElement.grid.connections[i].inputIndex ===
          $inVariableClicked.inputIndex &&
        $clickedElement.grid.connections[i].in ===
          $inVariableClicked.functionId &&
        $clickedElement.grid.connections[i].outVariableId ===
          $outVariableClicked.variableId
      ) {
        connectionExists = true;
        break;
      }
    }

    if (!connectionExists) {
      await removeOverlappingVariableConnection();
      const createdConnection = await addConnection({
        in: $inVariableClicked.functionId,
        out: $outVariableClicked.functionId,
        elementId: $clickedElement._id,
        inputIndex: $inVariableClicked.inputIndex,
        outVariableId: $outVariableClicked.variableId,
      });

      if (createdConnection) {
        $clickedElement.grid.connections.push(createdConnection);
        $gridConnectionLocationsUpdatePending = true;
      }
    }

    $inVariableClicked = null;
    $outVariableClicked = null;
  };

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
    }

    $inArrowClicked = null;
    $outArrowClicked = null;
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

      $usingSelectionTool = true;
    }
  };

  const updateMousePosition = (e) => {
    selectionToolMousePosition = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const finalizeSelectionTool = () => {
    $usingSelectionTool = false;
    const selectedFunctionIds = [];
    for (let i = 0; i < $clickedElement.grid.functions.length; i++) {
      if (
        $clickedElement.grid.functions[i].rect.x >=
          selectionToolStartLocation.x &&
        $clickedElement.grid.functions[i].rect.x <=
          selectionToolMousePosition.x &&
        $clickedElement.grid.functions[i].rect.y >=
          selectionToolStartLocation.y &&
        $clickedElement.grid.functions[i].rect.y <= selectionToolMousePosition.y
      ) {
        selectedFunctionIds.push($clickedElement.grid.functions[i]._id);
      }
    }
  };

  $: if ($elementUpdated === true) {
    $elementUpdated = false;
  }
</script>

<svelte:window
  on:mousemove={updateMousePosition}
  on:mouseup={(e) => {
    if ($usingSelectionTool) {
      finalizeSelectionTool();
    }
  }}
  on:mouseleave={(e) => {
    if ($usingSelectionTool) {
      finalizeSelectionTool();
    }
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
    transition:fade={{ duration: 100 }}
    bind:this={element}
    on:mousedown={(e) => updateSelectionToolProps(e)}
    on:mouseleave={() => {
      $functionMoving = null;
    }}
  >
    {#if $usingSelectionTool && !$functionMoving}
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
