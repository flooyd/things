<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import {
    elementOnTheFrontBurner,
    outArrowClicked,
    inArrowClicked,
    functionMoving,
    mouseDownStartedOnArrow,
    gridConnectionLocationsUpdatePending,
    outVariableClicked,
    inVariableClicked,
    outputClicked,
    usingSelectionTool,
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

  onMount(async () => {
    if (!$elementOnTheFrontBurner) return;
    if ($elementOnTheFrontBurner.programmingGrid) {
      ready = true;
      return;
    }
    let functionsForElement = await fetchFunctions(
      $elementOnTheFrontBurner._id
    );
    $elementOnTheFrontBurner.programmingGrid = [];
    $elementOnTheFrontBurner.programmingGrid.connections = [];
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

    $elementOnTheFrontBurner.programmingGrid.functions = functionsForElement;

    const connectionsForElement = await getAllConnectionsForElement(
      $elementOnTheFrontBurner._id
    );

    if (connectionsForElement.length > 0) {
      $elementOnTheFrontBurner.programmingGrid.connections =
        connectionsForElement;
    }

    $elementOnTheFrontBurner.programmingGrid.connections =
      connectionsForElement;
    $gridConnectionLocationsUpdatePending++;
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
    for (
      let i = 0;
      i < $elementOnTheFrontBurner.programmingGrid.connections.length;
      i++
    ) {
      if (
        $elementOnTheFrontBurner.programmingGrid.connections[i].in ===
          $inVariableClicked.functionId &&
        $elementOnTheFrontBurner.programmingGrid.connections[i].inputIndex ===
          $inVariableClicked.inputIndex
      ) {
        await deleteConnectionById(
          $elementOnTheFrontBurner.programmingGrid.connections[i]._id
        );
        existingConnectionDeleted =
          $elementOnTheFrontBurner.programmingGrid.connections[i]._id;
      }

      if (existingConnectionDeleted) {
        $elementOnTheFrontBurner.programmingGrid.connections =
          $elementOnTheFrontBurner.programmingGrid.connections.filter(
            (conn) => conn._id != existingConnectionDeleted
          );
      }
    }
  };

  const createOutputConnection = async () => {
    let connectionExists = false;
    for (
      let i = 0;
      i < $elementOnTheFrontBurner.programmingGrid.connections.length;
      i++
    ) {
      if (
        $elementOnTheFrontBurner.programmingGrid.connections[i].outputIndex ===
          $outputClicked.outputIndex &&
        $elementOnTheFrontBurner.programmingGrid.connections[i].in ===
          $inVariableClicked.functionId &&
        $elementOnTheFrontBurner.programmingGrid.connections[i].inputIndex ===
          $inVariableClicked.inputIndex &&
        $elementOnTheFrontBurner.programmingGrid.connections[i].out ===
          $outputClicked.functionId
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
        elementId: $elementOnTheFrontBurner._id,
      };

      const createdConnection = await addConnection(connection);
      if (createdConnection) {
        $elementOnTheFrontBurner.programmingGrid.connections.push(
          createdConnection
        );
        $gridConnectionLocationsUpdatePending++;
      }

      $outputClicked = null;
      $inVariableClicked = null;
    }
  };

  const createVariableConnection = async () => {
    let connectionExists = false;
    for (
      let i = 0;
      i < $elementOnTheFrontBurner.programmingGrid.connections.length;
      i++
    ) {
      if (
        $elementOnTheFrontBurner.programmingGrid.connections[i].inputIndex ===
          $inVariableClicked.inputIndex &&
        $elementOnTheFrontBurner.programmingGrid.connections[i].in ===
          $inVariableClicked.functionId &&
        $elementOnTheFrontBurner.programmingGrid.connections[i]
          .outVariableId === $outVariableClicked.variableId
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
        elementId: $elementOnTheFrontBurner._id,
        inputIndex: $inVariableClicked.inputIndex,
        outVariableId: $outVariableClicked.variableId,
      });

      if (createdConnection) {
        $elementOnTheFrontBurner.programmingGrid.connections.push(
          createdConnection
        );
        $gridConnectionLocationsUpdatePending++;
      }
    }

    $inVariableClicked = null;
    $outVariableClicked = null;
  };

  const createConnection = async () => {
    let connectionExists = false;
    for (
      let i = 0;
      i < $elementOnTheFrontBurner.programmingGrid.connections.length;
      i++
    ) {
      if (
        $elementOnTheFrontBurner.programmingGrid.connections[i].in ===
          $inArrowClicked &&
        $elementOnTheFrontBurner.programmingGrid.connections[i].out ===
          $outArrowClicked
      ) {
        connectionExists = true;
        break;
      }
    }

    if (!connectionExists) {
      const createdConnection = await addConnection({
        in: $inArrowClicked,
        out: $outArrowClicked,
        elementId: $elementOnTheFrontBurner._id,
      });

      if (createdConnection) {
        $elementOnTheFrontBurner.programmingGrid.connections.push(
          createdConnection
        );
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
    for (
      let i = 0;
      i < $elementOnTheFrontBurner.programmingGrid.functions.length;
      i++
    ) {
      if (
        $elementOnTheFrontBurner.programmingGrid.functions[i].rect.x >=
          selectionToolStartLocation.x &&
        $elementOnTheFrontBurner.programmingGrid.functions[i].rect.x <=
          selectionToolMousePosition.x &&
        $elementOnTheFrontBurner.programmingGrid.functions[i].rect.y >=
          selectionToolStartLocation.y &&
        $elementOnTheFrontBurner.programmingGrid.functions[i].rect.y <=
          selectionToolMousePosition.y
      ) {
        selectedFunctionIds.push(
          $elementOnTheFrontBurner.programmingGrid.functions[i]._id
        );
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
{#if !$elementOnTheFrontBurner}
  <div class="noElement">
    <div class="title">No Element Selected</div>
    <div class="hideGrid">
      Click Hide Grid above and select an element by double clicking it.
    </div>
  </div>
{/if}
{#if ready}
  <div
    class="programmingGrid"
    in:fade={{ duration: 100 }}
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
  .programmingGrid {
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
