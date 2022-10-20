<script>
  import { onMount, tick } from "svelte";
  import { fade, fly } from "svelte/transition";
  import {
    clickedElement,
    outArrowClicked,
    inArrowClicked,
    functionMoving,
    mouseDownStartedOnArrow,
    gridConnectionLocationsUpdatePending,
  } from "../stores/globals";
  import {
    objects,
    executables,
    functionOutputs,
    functionInputs,
    objectDescriptions,
    typeColors,
    objectColors,
    saveFunction,
    deleteAllConnectionsForFunction,
    deleteFunctionById,
  } from "../util";

  export let gridFunction;

  let element = null;
  let numOutputs = 0;
  let numInputs = 0;
  let typesOfInput = null;
  let typeOfOutput;
  let ready = false;
  let initialized = false;
  let inputCircleInput = null;
  let inputCircleTextarea = null;
  let inputDisabled = true;
  let rect = {
    x: gridFunction.rect.x,
    y: gridFunction.rect.y,
    width: 0,
    height: 0,
    initialized: false,
  };
  let style = null;
  let functionDirty = false;
  let contextMenuOpen = false;
  let functionHovered = false;
  let pendingDelete = false;

  onMount(() => {
    numOutputs = functionOutputs[gridFunction.name]?.count || 0;
    numInputs = functionInputs[gridFunction.name]?.count || 0;
    typeOfOutput = functionOutputs[gridFunction.name]?.type || "any";
    typesOfInput = functionInputs[gridFunction.name]?.types || ["any"];
    ready = true;
  });

  const move = (e) => {
    if (pendingDelete) return;
    if ($functionMoving === gridFunction._id) {
      setRect(e.movementX, e.movementY);
    }
  };

  const stop = async (e) => {
    $functionMoving = null;
    functionDirty = true;
  };

  const start = (e) => {
    if (!$mouseDownStartedOnArrow) {
      $functionMoving = gridFunction._id;
    }
  };

  const setRect = (movementLeft = 0, movementTop = 0) => {
    if (rect.x < 3 && movementLeft < 0) {
      return;
    }
    if (rect.y < 3 && movementTop < 0) {
      return;
    }
    rect.x = rect.x + movementLeft;
    rect.y = rect.y + movementTop;

    const inArrowLocation = {
      x: rect.x + 10,
      y: rect.y + rect.height - 6 - 15 - numOutputs * 36 - numInputs * 36,
    };
    const outArrowLocation = {
      x: rect.x + rect.width - 10,
      y: rect.y + rect.height - 6 - 15 - numOutputs * 36 - numInputs * 36,
    };

    $clickedElement.grid.functions.find(
      (f) => f._id === gridFunction._id
    ).rect = {
      x: rect.x,
      y: rect.y,
      inArrowLocation,
      outArrowLocation,
    };

    $clickedElement = $clickedElement;
  };

  const handleClickArrow = async (type, e) => {
    $mouseDownStartedOnArrow = true;
    await tick();
    if (type === "out") {
      $outArrowClicked = gridFunction._id;
    }

    if (type === "in" && $outArrowClicked) {
      $inArrowClicked = gridFunction._id;
    }
  };

  $: if (element && !initialized) {
    rect.width = element.clientWidth;
    rect.height = element.clientHeight;
    initialized = true;
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
      $clickedElement.grid.connections =
        $clickedElement.grid.connections.filter((conn) => {
          return conn.in !== gridFunction._id && conn.out !== gridFunction._id;
        });
      $gridConnectionLocationsUpdatePending = true;
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
      $clickedElement.grid.functions = $clickedElement.grid.functions.filter(
        (func) => func._id !== gridFunction._id
      );
      $clickedElement = $clickedElement;
    } else {
      alert(
        "Something went wrong trying to remove this function. It wasn't removed from the element."
      );
    }
  };

  $: if ($functionMoving === gridFunction._id) {
    style = `z-index: 1000; top:${rect?.y || 0}px; left: ${rect?.x || 0}px;`;
  } else {
    style = `top:${rect?.y || 0}px; left: ${rect?.x || 0}px;`;
  }
</script>

<svelte:window on:mousemove={move} />
{#if ready}
  <div
    on:mousedown={(e) => {
      e.stopPropagation();
      $functionMoving = gridFunction._id;
      start();
    }}
    on:mouseup={(e) => {
      stop();
    }}
    on:mouseenter={() => {
      inputDisabled = false;
      functionHovered = gridFunction._id;
    }}
    on:mouseleave={() => {
      inputDisabled = true;
      $functionMoving = null;
      contextMenuOpen = false;
      functionHovered = false;
    }}
    on:contextmenu={(e) => {
      e.preventDefault();
      contextMenuOpen = !contextMenuOpen;
    }}
    class="gridFunction"
    bind:this={element}
    {style}
    in:fly={{ x: -500, duration: 150 }}
  >
    {#if contextMenuOpen}
      <div
        out:fade={{ duration: 150 }}
        on:mouseleave={() => (contextMenuOpen = false)}
        class="contextMenu"
      >
        <button class="redButton" on:mousedown={(e) => deleteFunction(e)}
          >Delete</button
        >
        <button class="threethreesButton" on:click={() => removeConnections()}
          >Remove Connections</button
        >
      </div>
    {/if}
    <div out:fade={{ duration: 100 }} class="label">
      {objectDescriptions[objects[gridFunction.name]]}
    </div>
    <div out:fade={{ duration: 100 }} class="top">
      {#if executables.includes(gridFunction.name)}
        <div
          out:fade={{ duration: 100 }}
          class={"inArrow" + " " + objectColors[objects[gridFunction.name]]}
          on:focus
          on:mousedown={(e) => handleClickArrow("in", e)}
        >
          ▶
        </div>
      {/if}
      <div out:fade={{ duration: 100 }} class="gridFunctionName">
        {gridFunction.name}
      </div>
      {#if objects[gridFunction.name] !== "jump" && objects[gridFunction.name] !== "return"}
        <div
          class={"outArrow" + " " + objectColors[objects[gridFunction.name]]}
          on:focus
          on:mousedown={(e) => handleClickArrow("out", e)}
        >
          ▶
        </div>
      {/if}
    </div>
    <div out:fade={{ duration: 100 }} class="outputs">
      {#each Array(numOutputs) as _, i}
        <div class="output">
          <div class="outputCircle">
            <span class="outputCircleType">{typeOfOutput}</span>
            <i class={"fas fa-circle" + " " + typeColors[typeOfOutput]} />
          </div>
        </div>
      {/each}
    </div>
    <div out:fade={{ duration: 100 }} class="inputs">
      {#each Array(numInputs) as _, i}
        <div class="input">
          <i class={"fas fa-circle" + " " + typeColors[typesOfInput[i]]} />
          <span class="inputCircleType">{typesOfInput[i]}</span>
          {#if typesOfInput[i] === "number"}
            <input
              class="inputCircleInput"
              bind:this={inputCircleInput}
              type="number"
              disabled={inputDisabled}
            />
          {/if}
          {#if typesOfInput[i] === "string" || (typesOfInput[i] === "any" && objects[gridFunction.name] === "console")}
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
    width: fit-content;
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
    opacity: 1;
  }

  .contextMenu {
    position: absolute;
    min-width: 220px;
    width: fit-content;
    left: -3px;
    bottom: -62px;
    gap: 8px;
    background: white;
    border: 3px solid black;
    border-collapse: collapse;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
    min-height: 40px;
    cursor: pointer;
    padding: 8px;
    border-radius: 5px;
    font-size: 13px;
  }

  .top {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    gap: 8px;
    height: 30px;
  }

  .output {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: right;
    height: 36px;
  }

  .outputCircle {
    padding: 5px;
  }

  .outputCircleType {
    margin-right: 8px;
    color: black;
  }

  .input {
    display: flex;
    width: fit-content;
    min-width: fit-content;
    justify-content: left;
    align-items: center;
    gap: 4px;
    height: 36px;
  }

  .inputCircle {
    padding: 5px;
  }

  .inputCircleType {
    margin-left: 8px;
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
    color: black;
    background: transparent;
  }

  .green:hover {
    color: black;
    background: transparent;
  }

  .blue:hover {
    color: black;
    background: transparent;
  }

  .yellow:hover {
    color: black;
    background: transparent;
  }

  .purple:hover {
    color: black;
    background: transparent;
  }

  .orange:hover {
    background: transparent;
    color: black;
  }

  .pink:hover {
    background: transparent;
    color: black;
  }

  .cyan:hover {
    background: transparent;
    color: black;
  }

  .brown:hover {
    background: transparent;
    color: black;
  }

  .gray:hover {
    background: transparent;
    color: black;
  }

  .teal:hover {
    background: transparent;
    color: black;
  }

  .inArrow:hover,
  .outArrow:hover {
    background: white;
    border-radius: 180px;
  }

  .inputCircle,
  .outputCircle {
    cursor: pointer;
  }
</style>
