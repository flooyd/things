<script>
  import { onMount, tick } from "svelte";
  import {
    clickedElement,
    outArrowClicked,
    inArrowClicked,
    draggableMoving,
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
  } from "../util";

  export let gridFunction;
  export let gridRect;

  let element = null;
  let rect = null;
  let numOutputs = 0;
  let numInputs = 0;
  let typesOfInput = null;
  let typeOfOutput;
  let ready = false;
  let initialized = false;
  let inputCircleInput = null;
  let inputDisabled = true;

  onMount(() => {
    numOutputs = functionOutputs[gridFunction.name]?.count || 0;
    numInputs = functionInputs[gridFunction.name]?.count || 0;
    typeOfOutput = functionOutputs[gridFunction.name]?.type || "any";
    typesOfInput = functionInputs[gridFunction.name]?.types || ["any"];
    console.log(typesOfInput);
    ready = true;
  });

  const setRect = () => {
    rect = element.getBoundingClientRect();
    rect.x = rect.x - gridRect.x;
    rect.y = rect.y - gridRect.y;

    // y of the arrows are calculated like so:
    // top of the rect + height of the rect -6 for the padding at the bottom
    // of the function. The arrows are 30px tall so we subtract 15 to get the
    // center of the arrow. Then, for each additional arrow (input or output),
    // we subtract 30 additional pixels.
    const inArrowLocation = {
      x: rect.left + 10,
      y: rect.top + rect.height - 6 - 15 - numOutputs * 30 - numInputs * 30,
    };
    const outArrowLocation = {
      x: rect.left + rect.width - 10,
      y: rect.top + rect.height - 6 - 15 - numOutputs * 30 - numInputs * 30,
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

  setInterval(() => {
    if ($draggableMoving && $functionMoving === gridFunction._id) {
      setRect();
    }
  }, 10);

  //if element is not null and initialized is false, set the rect and set initialized to true
  $: if (element && !initialized) {
    setRect();
    initialized = true;
  }

  $: console.log(inputDisabled);
</script>

<svelte:window
  on:mouseup={() => {
    setRect();
    $draggableMoving = false;
    $mouseDownStartedOnArrow = false;
  }}
/>
{#if ready}
  <div
    on:click={() => {
      $functionMoving = gridFunction._id;
    }}
    on:mousedown={() => {
      $functionMoving = gridFunction._id;
    }}
    on:mouseenter={() => {
      console.log("enter");
      inputDisabled = false;
    }}
    on:mouseleave={() => {
      console.log("leave");
      inputDisabled = true;
    }}
    class="gridFunction"
    bind:this={element}
    style={$functionMoving === gridFunction._id
      ? `z-index: 1000; background: 'white';`
      : ""}
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
      <div
        class={"outArrow" + " " + objectColors[objects[gridFunction.name]]}
        on:focus
        on:mousedown={(e) => handleClickArrow("out", e)}
      >
        ▶
      </div>
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
            {#if typesOfInput[i] === "string" || typesOfInput[i] === "number"}
              <input
                class="inputCircleInput"
                bind:this={inputCircleInput}
                type={typesOfInput[i] === "string" ? "text" : "number"}
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
    min-width: 150px;
    padding: 6px;
    border: 2px solid black;
    border-radius: 5px;
    display: flex;
    position: relative;
    flex-direction: column;
    background: #aaa;
    color: black;
    z-index: 2;
    box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
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
