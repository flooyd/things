<script>
  import { onMount, tick } from "svelte";
  import {
    clickedElement,
    outArrowClicked,
    inArrowClicked,
    functionMoving,
    mouseDownStartedOnArrow,
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

  onMount(() => {
    numOutputs = functionOutputs[gridFunction.name]?.count || 0;
    numInputs = functionInputs[gridFunction.name]?.count || 0;
    typeOfOutput = functionOutputs[gridFunction.name]?.type || "any";
    typesOfInput = functionInputs[gridFunction.name]?.types || ["any"];
    ready = true;
  });

  const move = (e) => {
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
      y: rect.y + rect.height - 6 - 15 - numOutputs * 30 - numInputs * 30,
    };
    const outArrowLocation = {
      x: rect.x + rect.width - 10,
      y: rect.y + rect.height - 6 - 15 - numOutputs * 30 - numInputs * 30,
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
      saveFunction(gridFunction._id);
      functionDirty = false;
    }
  }, 2000);

  $: if ($functionMoving === gridFunction._id) {
    style = `z-index: 1000; top:${rect?.y || 0}px; left: ${rect?.x || 0}px;`;
  } else {
    style = `top:${rect?.y || 0}px; left: ${rect?.x || 0}px;`;
  }

  console.log("gridFunction", gridFunction);
  console.log(objects[gridFunction.name]);
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
    }}
    on:mouseleave={() => {
      inputDisabled = true;
      $functionMoving = null;
    }}
    class="gridFunction"
    bind:this={element}
    {style}
  >
    <div class="label">
      {objectDescriptions[objects[gridFunction.name]]}
    </div>
    <div class="top">
      {#if executables.includes(gridFunction.name)}
        <div
          class={"inArrow" + " " + objectColors[objects[gridFunction.name]]}
          on:focus
          on:mousedown={(e) => handleClickArrow("in", e)}
        >
          ▶
        </div>
      {/if}
      <div class="gridFunctionName">{gridFunction.name}</div>
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
    <div class="outputs">
      {#each Array(numOutputs) as _, i}
        <div class="output">
          <div class="outputCircle">
            <span class="outputCircleType">{typeOfOutput}</span>
            <i class={"fas fa-circle" + " " + typeColors[typeOfOutput]} />
          </div>
        </div>
      {/each}
    </div>
    <div class="inputs">
      {#each Array(numInputs) as _, i}
        <div class="input">
          <div class="inputCircle">
            <i class={"fas fa-circle" + " " + typeColors[typesOfInput[i]]} />
            <span class="inputCircleType">{typesOfInput[i]}</span>
            {#if typesOfInput[i] === "string" || typesOfInput[i] === "number" || (typesOfInput[i] === "any" && objects[gridFunction.name] === "console")}
              <input
                class="inputCircleInput"
                bind:this={inputCircleInput}
                type={typesOfInput[i] === "string" || typesOfInput[i] === "any"
                  ? "text"
                  : "number"}
                disabled={inputDisabled}
              />
            {/if}
          </div>
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
    border: 2px solid black;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    background: #aaa;
    color: black;
    z-index: 999;
    font-size: 16px;
    box-shadow: 4px 4px 2px 0px rgba(0, 0, 0, 0.75);
    cursor: grab;
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
    height: 30px;
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
    align-items: center;
    width: 100%;
    justify-content: left;
    height: 30px;
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

  .inputCircle span {
    color: black;
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
