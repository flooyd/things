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
    mimic,
  } from "../stores/globals";
  import {
    addConnection,
    deleteConnectionById,
    fetchFunctions,
    getAllConnectionsForElement,
  } from "../util.js";
  import SelectionTool from "./SelectionTool.svelte";

  let element = null;
  let rect = null;
  let ready = false;
  let selectionToolStartLocation = null;
  let selectionToolMousePosition = null;
  let containingObject = null;

  $: $mimic && !$mimic.isThing
    ? (containingObject = $mimic)
    : $clickedElement
    ? (containingObject = $clickedElement)
    : null;

  onMount(async () => {
    if (!$clickedElement && !$mimic) return;
    //add mimic as mimicId to fetchFunctionsForElement params in util.js
    let functionsForElement = await fetchFunctions(
      $mimic ? $mimic._id : $clickedElement._id
    );
    containingObject.grid = [];
    containingObject.grid.connections = [];
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

    containingObject.grid.functions = functionsForElement;

    const connectionsForElement = await getAllConnectionsForElement(
      containingObject._id
    );

    if (connectionsForElement.length > 0) {
      containingObject.grid.connections = connectionsForElement;
    }

    containingObject.grid.connections = connectionsForElement;
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
    for (let i = 0; i < containingObject.grid.connections.length; i++) {
      if (
        containingObject.grid.connections[i].in ===
          $inVariableClicked.functionId &&
        containingObject.grid.connections[i].inputIndex ===
          $inVariableClicked.inputIndex
      ) {
        await deleteConnectionById(containingObject.grid.connections[i]._id);
        existingConnectionDeleted = containingObject.grid.connections[i]._id;
      }

      if (existingConnectionDeleted) {
        containingObject.grid.connections =
          containingObject.grid.connections.filter(
            (conn) => conn._id != existingConnectionDeleted
          );
      }
    }
  };

  const createOutputConnection = async () => {
    let connectionExists = false;
    for (let i = 0; i < containingObject.grid.connections.length; i++) {
      if (
        containingObject.grid.connections[i].outputIndex ===
          $outputClicked.outputIndex &&
        containingObject.grid.connections[i].in ===
          $inVariableClicked.functionId &&
        containingObject.grid.connections[i].inputIndex ===
          $inVariableClicked.inputIndex &&
        containingObject.grid.connections[i].out === $outputClicked.functionId
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
        elementId: containingObject._id,
      };

      const createdConnection = await addConnection(connection);
      if (createdConnection) {
        containingObject.grid.connections.push(createdConnection);
        $gridConnectionLocationsUpdatePending = true;
      }

      $outputClicked = null;
      $inVariableClicked = null;
    }
  };

  const createVariableConnection = async () => {
    let connectionExists = false;
    for (let i = 0; i < containingObject.grid.connections.length; i++) {
      if (
        containingObject.grid.connections[i].inputIndex ===
          $inVariableClicked.inputIndex &&
        containingObject.grid.connections[i].in ===
          $inVariableClicked.functionId &&
        containingObject.grid.connections[i].outVariableId ===
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
        elementId: containingObject._id,
        inputIndex: $inVariableClicked.inputIndex,
        outVariableId: $outVariableClicked.variableId,
      });

      if (createdConnection) {
        containingObject.grid.connections.push(createdConnection);
        $gridConnectionLocationsUpdatePending = true;
      }
    }

    $inVariableClicked = null;
    $outVariableClicked = null;
  };

  const createConnection = async () => {
    let connectionExists = false;
    for (let i = 0; i < containingObject.grid.connections.length; i++) {
      if (
        containingObject.grid.connections[i].in === $inArrowClicked &&
        containingObject.grid.connections[i].out === $outArrowClicked
      ) {
        connectionExists = true;
        break;
      }
    }

    if (!connectionExists) {
      const createdConnection = await addConnection({
        in: $inArrowClicked,
        out: $outArrowClicked,
        elementId: containingObject._id,
      });

      if (createdConnection) {
        containingObject.grid.connections.push(createdConnection);
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
    for (let i = 0; i < containingObject.grid.functions.length; i++) {
      if (
        containingObject.grid.functions[i].rect.x >=
          selectionToolStartLocation.x &&
        containingObject.grid.functions[i].rect.x <=
          selectionToolMousePosition.x &&
        containingObject.grid.functions[i].rect.y >=
          selectionToolStartLocation.y &&
        containingObject.grid.functions[i].rect.y <=
          selectionToolMousePosition.y
      ) {
        selectedFunctionIds.push(containingObject.grid.functions[i]._id);
      }
    }
  };
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
{#if !containingObject}
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
