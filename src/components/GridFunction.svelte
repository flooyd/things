<script>
  import { onMount, tick } from "svelte";
  import { fade, fly } from "svelte/transition";
  import {
    clickedElement,
    outArrowClicked,
    inArrowClicked,
    outVariableClicked,
    inVariableClicked,
    functionMoving,
    mouseDownStartedOnArrow,
    gridConnectionLocationsUpdatePending,
    lastInteractedWith,
    variablesStore,
    variableUpdated,
    outputClicked,
    usingSelectionTool,
  } from "../stores/globals";
  import {
    typeColors,
    saveFunction,
    deleteAllConnectionsForFunction,
    deleteFunctionById,
    epicFunctions,
  } from "../util";

  export let gridFunction;

  let element = null;
  let numOutputs = 0;
  let numInputs = 0;
  let typesOfInputs = null;
  let typesOfOutputs;
  let ready = false;
  let inputCircleInput = null;
  let inputCircleTextarea = null;
  let inputDisabled = true;
  let rect = {
    x: gridFunction.rect.x,
    y: gridFunction.rect.y,
    width: 0,
    height: 0,
  };
  let style = null;
  let functionDirty = false;
  let contextMenuOpen = false;
  let functionHovered = false;
  let pendingDelete = false;
  let initialized = false;
  let variable = null;
  let variableTypeColor = null;

  onMount(() => {
    numOutputs = epicFunctions[gridFunction.name]?.outputs.count || 0;
    numInputs = epicFunctions[gridFunction.name]?.inputs.count || 0;
    typesOfOutputs = epicFunctions[gridFunction.name]?.outputs.types || [];
    typesOfInputs = epicFunctions[gridFunction.name]?.inputs.types || [];
    ready = true;
  });

  const move = (e) => {
    if (pendingDelete || $usingSelectionTool || !$functionMoving) return;
    if ($functionMoving === gridFunction._id) {
      setRect(
        e.movementX,
        e.movementY,
        element.clientWidth,
        element.clientHeight
      );
    }
  };

  const stop = async (e) => {
    await tick();
    $functionMoving = null;
    functionDirty = true;
  };

  const start = (e) => {
    if (!$mouseDownStartedOnArrow) {
      $functionMoving = gridFunction._id;
    }
  };

  const setRect = async (movementLeft = 0, movementTop = 0, width, height) => {
    if (rect.x === 0 && movementLeft < 0) {
      return;
    }
    if (rect.y === 0 && movementTop < 0) {
      return;
    }
    rect.x = rect.x + movementLeft;
    rect.y = rect.y + movementTop;

    const inArrowLocation = {
      x:
        rect.x +
        6 + //padding of left of function
        5 + //padding left of the input arrow
        7 + //half the width of the input arrow
        3, //border width on left of function
      y:
        rect.y +
        3 + //half the width of line
        6 + // padding of top of function
        16 + // height of the label
        4 + // padding-bottom of label
        1 + // border-bottom of label
        8 + // margin-bottom of label
        19, // center point of height (37) of row (topName in this case)
    };
    const outArrowLocation = {
      x: rect.x + width - 5 - 7 - 6, //padding of left of function
      y:
        rect.y +
        3 + //half the width of line
        6 + // padding of top of function
        16 + // height of the label
        4 + // padding-bottom of label
        1 + // border-bottom of label
        8 + // margin-bottom of label
        19, // center point of height (37) of row (topName in this case)
    };

    $clickedElement.programmingGrid.functions.find(
      (f) => f._id === gridFunction._id
    ).rect = {
      x: rect.x,
      y: rect.y,
      inArrowLocation,
      outArrowLocation,
      width: width,
      height: height,
    };
  };

  const handleClickArrow = async (type) => {
    $outVariableClicked = null;
    $mouseDownStartedOnArrow = true;
    await tick();
    if (type === "out") {
      $outArrowClicked = gridFunction._id;
    }

    if (type === "in" && $outArrowClicked) {
      $inArrowClicked = gridFunction._id;
    }
  };

  const handleClickVariable = async (
    type,
    variableId = null,
    inputIndex = null
  ) => {
    $outArrowClicked = null;
    if (type === "out") {
      $outVariableClicked = { variableId, functionId: gridFunction._id };
    }

    if (
      (type === "in" && $outVariableClicked) ||
      (type === "in" && $outputClicked)
    ) {
      $inVariableClicked = {
        functionId: gridFunction._id,
        inputIndex: inputIndex + 1,
      };
    }
  };

  const handleClickOutput = (outputIndex) => {
    $outArrowClicked = null;
    $outVariableClicked = null;
    $outputClicked = {
      functionId: gridFunction._id,
      outputIndex: outputIndex + 1,
    };
  };

  $: if (ready && element && !initialized) {
    if (gridFunction.isVariable) {
      variable = $variablesStore.find((v) => v._id === gridFunction.variableId);
      if (variable) {
        variableTypeColor = typeColors[variable.type];
      }
    }
    setRect(0, 0, element.clientWidth, element.clientHeight);

    initialized = true;
  }

  $: if (
    gridFunction.isVariable &&
    $variableUpdated === gridFunction.variableId
  ) {
    variable = $variablesStore.find((v) => v._id === gridFunction.variableId);
    variableTypeColor = typeColors[variable.type];
  }

  setInterval(() => {
    if (functionDirty) {
      saveFunction(gridFunction._id, pendingDelete);
      functionDirty = false;
    }
  }, 2000);

  const removeConnections = async () => {
    const deleted = await deleteAllConnectionsForFunction(gridFunction._id);
    if (deleted) {
      $clickedElement.programmingGrid.connections =
        $clickedElement.programmingGrid.connections.filter((conn) => {
          return conn.in !== gridFunction._id && conn.out !== gridFunction._id;
        });
      $gridConnectionLocationsUpdatePending++;
    } else {
      alert(
        "Something went wrong trying to remove this function. All of their connections weren't removed."
      );
    }
  };

  const deleteFunction = async (e) => {
    if (!functionHovered) {
      return;
    }
    pendingDelete = true;
    await removeConnections();
    const deleted = await deleteFunctionById(gridFunction._id);
    if (deleted) {
      $clickedElement.programmingGrid.functions =
        $clickedElement.programmingGrid.functions.filter(
          (func) => func._id !== gridFunction._id
        );
    } else {
      alert(
        "Something went wrong trying to remove this function. It wasn't removed from the element."
      );
    }
  };

  $: if (
    $functionMoving === gridFunction._id ||
    $lastInteractedWith === gridFunction._id
  ) {
    style = `z-index: 1000; top:${rect?.y || 0}px; left: ${rect?.x || 0}px;`;
  } else {
    style = `top:${rect?.y || 0}px; left: ${rect?.x || 0}px;`;
  }

  const randInRange = (min, max) => {
    return Math.random() * (max - min) + min;
  };
</script>

<svelte:window on:mousemove={move} />
{#if ready}
  <div
    on:mousedown={(e) => {
      e.stopPropagation();
      $lastInteractedWith = gridFunction._id;
      $functionMoving = gridFunction._id;
      start();
    }}
    on:mouseup={(e) => {
      stop();
    }}
    on:mouseenter={() => {
      inputDisabled = false;
      if (!$usingSelectionTool) {
        functionHovered = gridFunction._id;
      }
    }}
    on:mouseleave={() => {
      inputDisabled = true;
      $functionMoving = null;
      functionHovered = false;
    }}
    on:contextmenu={(e) => {
      e.preventDefault();
      contextMenuOpen = !contextMenuOpen;
    }}
    class="gridFunction"
    bind:this={element}
    {style}
    in:fly={{
      y: randInRange(-5000, 5000),
      x: randInRange(-5000, 5000),
      duration: 500,
    }}
  >
    {#if contextMenuOpen}
      <div
        out:fade={{ duration: 100 }}
        class="contextMenu"
        style={`left: ${element.clientWidth + 8}px; top: -3px;`}
      >
        <div class="buttons">
          <button class="redButton" on:mousedown={(e) => deleteFunction(e)}
            >Delete</button
          >
          <button class="threethreesbutton" on:click={() => removeConnections()}
            >Remove Connections</button
          >
          <button
            class="threethreesbutton"
            on:click={() => (contextMenuOpen = false)}
            ><i class="fa fa-times" />
          </button>
        </div>

        <div class="locationInfo">
          <div class="header">
            <div class="name">{gridFunction.name}</div>
            <div class="infoType">Location and Rectangle</div>
          </div>
          {#if gridFunction._id}
            {#each Object.keys($clickedElement.programmingGrid.functions.find((f) => f._id === gridFunction._id)?.rect || {}) as key}
              <div class="locationInfoItem">
                <div class="locationInfoItemKey">{key}</div>
                <div class="locationInfoItemValue">
                  {#if typeof $clickedElement.programmingGrid.functions.find((f) => f._id === gridFunction._id).rect[key] === "object"}
                    {#each Object.keys($clickedElement.programmingGrid.functions.find((f) => f._id === gridFunction._id)?.rect[key] || {}) as key2}
                      <div class="locationInfoItem">
                        <div class="locationInfoItemKey">{key2}</div>
                        <div class="locationInfoItemValue">
                          {$clickedElement.programmingGrid.functions.find(
                            (f) => f._id === gridFunction._id
                          ).rect[key][key2]}
                        </div>
                      </div>
                    {/each}
                  {:else}
                    {$clickedElement.programmingGrid.functions.find(
                      (f) => f._id === gridFunction._id
                    ).rect[key]}
                  {/if}
                </div>
              </div>
            {/each}
          {/if}
        </div>
      </div>
    {/if}
    <div class="label">
      {epicFunctions[gridFunction.name]?.category || "Variable"}
    </div>
    <div class="topName">
      {#if !gridFunction.isVariable && epicFunctions[gridFunction.name].executable}
        <div
          class={"inArrow" +
            " " +
            epicFunctions[gridFunction.name].categoryColor}
          on:focus
          on:mousedown={(e) => handleClickArrow("in", e)}
        >
          ▶
        </div>
      {/if}
      <div class="gridFunctionName">
        {variable ? variable.name : gridFunction.name}
      </div>
      {#if !gridFunction.isVariable && epicFunctions[gridFunction.name].category !== "jump" && epicFunctions[gridFunction.name].category !== "return"}
        <div
          class={"outArrow" +
            " " +
            epicFunctions[gridFunction.name].categoryColor}
          on:focus
          on:mousedown={(e) => handleClickArrow("out", e)}
        >
          ▶
        </div>
      {/if}
    </div>
    <div class="outputs">
      {#each Array(numOutputs) as _, i}
        <div class="output" on:click={() => handleClickOutput(i)}>
          <span class="outputCircleType">{typesOfOutputs}</span>
          <i class={"fas fa-circle" + " " + typeColors[typesOfOutputs]} />
        </div>
      {/each}
      {#if variable}
        <div
          class={"output" + " " + variableTypeColor}
          on:click={() => handleClickVariable("out", variable._id, null)}
        >
          <div class="outputCircle">
            <span class={"outputCircleType" + " " + variableTypeColor}
              >{variable.type}</span
            >
            <span class="outputCircleValue">{variable.value}</span>
            <i class={"fas fa-circle"} />
          </div>
        </div>
      {/if}
    </div>
    <div class="inputs">
      {#each Array(numInputs) as _, i}
        <div class="input" on:click={() => handleClickVariable("in", null, i)}>
          <i class={"fas fa-circle" + " " + typeColors[typesOfInputs[i]]} />
          <span class="inputCircleType">{typesOfInputs[i] || ""}</span>
          {#if epicFunctions[gridFunction.name]?.inputs?.optional && epicFunctions[gridFunction.name]?.inputs.optional[i] === true}
            <i class="fa fa-question" />
          {/if}
          {#if typesOfInputs[i] === "number"}
            <input
              class="inputCircleInput"
              bind:this={inputCircleInput}
              type="number"
              disabled={inputDisabled}
            />
          {/if}
          {#if typesOfInputs[i] === "string" || (typesOfInputs[i] === "any" && epicFunctions[gridFunction.name]?.category === "console")}
            <textarea
              class="inputCircleTextarea"
              bind:this={inputCircleTextarea}
              disabled={inputDisabled}
            />
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .gridFunction {
    min-width: 240px;
    position: absolute;
    padding: 6px;
    border: 3px solid black;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    background: #aaa;
    color: black;
    z-index: 999;
    font-size: 16px;
    box-shadow: 4px 4px 2px 0px rgba(0, 0, 0, 0.75);
    cursor: grab;
    opacity: 0.95;
  }

  .contextMenu {
    position: absolute;
    min-width: 300px;
    gap: 8px;
    background: white;
    border: 3px solid black;
    border-collapse: collapse;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 99999;
    min-height: 40px;
    cursor: pointer;
    padding: 8px;
    border-radius: 5px;
    font-size: 13px;
    opacity: 0.9;
  }

  .contextMenu .buttons {
    display: flex;
    gap: 8px;
    width: 100%;
    margin-bottom: 4px;
    justify-content: center;
  }

  .contextMenu .locationInfo {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }

  .contextMenu .locationInfo .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 4px;
  }

  .header .name,
  .header .infoType {
    font-weight: bold;
  }

  .header .infoType {
    font-size: 10px;
  }
  .contextMenu .locationInfoItem {
    display: flex;
    justify-content: space-between;
    padding: 4px;
    align-items: center;
    border: 1px solid black;
    gap: 8px;
    border-collapse: collapse;
  }

  .contextMenu .locationInfoItemKey {
    font-weight: bold;
  }

  .contextMenu .locationInfoItemValue {
    font-weight: normal;
  }

  .topName {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    gap: 8px;
    height: 37px;
  }

  .output {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: right;
    height: 37px;
    gap: 8px;
  }

  .outputCircleType {
    color: black;
  }

  .input {
    display: flex;
    width: fit-content;
    min-width: fit-content;
    justify-content: left;
    align-items: center;
    gap: 8px;
    height: 37px;
  }

  .inputCircleType {
    color: black;
  }

  .inArrow,
  .outArrow {
    cursor: pointer;
    padding: 5px;
  }

  .inputCircleInput {
    margin-left: 4px;
    width: 100px;
    border: 1px solid black;
    border-radius: 5px;
    padding: 4px;
  }

  .label {
    text-align: center;
    font-style: italic;
    font-weight: bold;
    padding-bottom: 4px;
    border-bottom: 1px solid black;
    margin-bottom: 8px;
  }

  .red:hover {
    background: transparent;
  }

  .green:hover {
    background: transparent;
  }

  .blue:hover {
    background: transparent;
  }

  .yellow:hover {
    background: transparent;
  }

  .purple:hover {
    background: transparent;
  }

  .orange:hover {
    background: transparent;
  }

  .pink:hover {
    background: transparent;
  }

  .cyan:hover {
    background: transparent;
  }

  .brown:hover {
    background: transparent;
  }

  .gray:hover {
    background: transparent;
  }

  .teal:hover {
    background: transparent;
  }

  .inArrow:hover,
  .outArrow:hover {
    background: white;
    border-radius: 180px;
  }

  .input,
  .output {
    cursor: pointer;
  }

  textarea {
    height: 30px;
  }
</style>
