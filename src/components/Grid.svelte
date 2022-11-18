<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import {
    componentOnTheFrontBurner,
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
    getAllConnectionsForComponent,
  } from "../util.js";
  import SelectionTool from "./SelectionTool.svelte";

  let element = null;
  let rect = null;
  let ready = false;
  let selectionToolStartLocation = null;
  let selectionToolMousePosition = null;

  onMount(async () => {
    if (!$componentOnTheFrontBurner) return;
    if ($componentOnTheFrontBurner.programmingGrid) {
      ready = true;
      return;
    }
    console.log("fetch functions");
    let functionsForComponent = await fetchFunctions(
      $componentOnTheFrontBurner
    );
    $componentOnTheFrontBurner.programmingGrid = [];
    $componentOnTheFrontBurner.programmingGrid.connections = [];
    functionsForComponent = functionsForComponent.map((func) => {
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

    $componentOnTheFrontBurner.programmingGrid.functions =
      functionsForComponent;

    const connectionsForComponent = await getAllConnectionsForComponent(
      $componentOnTheFrontBurner.componentName
    );

    if (connectionsForComponent.length > 0) {
      $componentOnTheFrontBurner.programmingGrid.connections =
        connectionsForComponent;
    }

    $componentOnTheFrontBurner.programmingGrid.connections =
      connectionsForComponent;
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
      i < $componentOnTheFrontBurner.programmingGrid.connections.length;
      i++
    ) {
      if (
        $componentOnTheFrontBurner.programmingGrid.connections[i].in ===
          $inVariableClicked.functionId &&
        $componentOnTheFrontBurner.programmingGrid.connections[i].inputIndex ===
          $inVariableClicked.inputIndex
      ) {
        await deleteConnectionById(
          $componentOnTheFrontBurner.programmingGrid.connections[i]._id
        );
        existingConnectionDeleted =
          $componentOnTheFrontBurner.programmingGrid.connections[i]._id;
      }

      if (existingConnectionDeleted) {
        $componentOnTheFrontBurner.programmingGrid.connections =
          $componentOnTheFrontBurner.programmingGrid.connections.filter(
            (conn) => conn._id != existingConnectionDeleted
          );
      }
    }
  };

  const createOutputConnection = async () => {
    let connectionExists = false;
    for (
      let i = 0;
      i < $componentOnTheFrontBurner.programmingGrid.connections.length;
      i++
    ) {
      if (
        $componentOnTheFrontBurner.programmingGrid.connections[i]
          .outputIndex === $outputClicked.outputIndex &&
        $componentOnTheFrontBurner.programmingGrid.connections[i].in ===
          $inVariableClicked.functionId &&
        $componentOnTheFrontBurner.programmingGrid.connections[i].inputIndex ===
          $inVariableClicked.inputIndex &&
        $componentOnTheFrontBurner.programmingGrid.connections[i].out ===
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
        componentName: $componentOnTheFrontBurner.componentName,
      };

      const createdConnection = await addConnection(connection);
      if (createdConnection) {
        $componentOnTheFrontBurner.programmingGrid.connections.push(
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
      i < $componentOnTheFrontBurner.programmingGrid.connections.length;
      i++
    ) {
      if (
        $componentOnTheFrontBurner.programmingGrid.connections[i].inputIndex ===
          $inVariableClicked.inputIndex &&
        $componentOnTheFrontBurner.programmingGrid.connections[i].in ===
          $inVariableClicked.functionId &&
        $componentOnTheFrontBurner.programmingGrid.connections[i]
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
        componentName: $componentOnTheFrontBurner.componentName,
        inputIndex: $inVariableClicked.inputIndex,
        outVariableId: $outVariableClicked.variableId,
      });

      if (createdConnection) {
        $componentOnTheFrontBurner.programmingGrid.connections.push(
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
      i < $componentOnTheFrontBurner.programmingGrid.connections.length;
      i++
    ) {
      if (
        $componentOnTheFrontBurner.programmingGrid.connections[i].in ===
          $inArrowClicked &&
        $componentOnTheFrontBurner.programmingGrid.connections[i].out ===
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
        componentName: $componentOnTheFrontBurner.componentName,
      });

      if (createdConnection) {
        $componentOnTheFrontBurner.programmingGrid.connections.push(
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
      i < $componentOnTheFrontBurner.programmingGrid.functions.length;
      i++
    ) {
      if (
        $componentOnTheFrontBurner.programmingGrid.functions[i].rect.x >=
          selectionToolStartLocation.x &&
        $componentOnTheFrontBurner.programmingGrid.functions[i].rect.x <=
          selectionToolMousePosition.x &&
        $componentOnTheFrontBurner.programmingGrid.functions[i].rect.y >=
          selectionToolStartLocation.y &&
        $componentOnTheFrontBurner.programmingGrid.functions[i].rect.y <=
          selectionToolMousePosition.y
      ) {
        selectedFunctionIds.push(
          $componentOnTheFrontBurner.programmingGrid.functions[i]._id
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
{#if !$componentOnTheFrontBurner}
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
