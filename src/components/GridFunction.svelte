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
  } from "../util";

  export let gridFunction;
  export let gridRect;

  let element = null;
  let rect = null;
  let numOutputs = 0;
  let numInputs = 0;
  let typeOfInput = null;
  let typeOfInputTwo = null;
  let typeOfOutput;
  let ready = false;
  let initialized = false;

  onMount(() => {
    numOutputs = functionOutputs[gridFunction.name]?.count || 0;
    numInputs = functionInputs[gridFunction.name]?.count || 0;
    typeOfOutput = functionOutputs[gridFunction.name]?.type || "any";
    typeOfInput = functionInputs[gridFunction.name]?.type || "any";
    typeOfInputTwo = functionInputs[gridFunction.name]?.type2 || null;
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
    console.log($mouseDownStartedOnArrow, "mouseDownStartedOnArrow");
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
    class="gridFunction"
    bind:this={element}
  >
    <div class="label">
      {objectDescriptions[objects[gridFunction.name]]}
    </div>
    <div class="top">
      {#if executables.includes(gridFunction.name)}
        <div
          class="inArrow"
          on:focus
          on:mousedown={(e) => handleClickArrow("in", e)}
        >
          ▶
        </div>
      {/if}
      <div class="gridFunctionName">{gridFunction.name}</div>
      <div
        class="outArrow"
        on:focus
        on:mousedown={(e) => handleClickArrow("out", e)}
      >
        ▶
      </div>
    </div>
    <div class="outputs">
      {#each Array(numOutputs) as _, i}
        <div class="output">
          <div class={"outputCircle" + " " + typeColors[typeOfOutput]}>
            <span class="outputCircleType">{typeOfOutput}</span>
            <i class="fas fa-circle" />
          </div>
        </div>
      {/each}
    </div>
    <div class="inputs">
      {#each Array(numInputs) as _, i}
        <div class="input">
          {#if (typeOfInput && i === 0) || !typeOfInputTwo}
            <div class={"inputCircle" + " " + typeColors[typeOfInput]}>
              <i class="fas fa-circle" />
              <span class="inputCircleType">{typeOfInput}</span>
            </div>
          {/if}
          {#if typeOfInputTwo && i === 1}
            <div class={"inputCircle" + " " + typeColors[typeOfInputTwo]}>
              <i class="fas fa-circle" />
              <span class="inputCircleType">{typeOfInputTwo}</span>
            </div>
          {/if}
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
    z-index: 99999;
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
    color: lightblue;
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
    color: lightblue;
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

  .inArrow:hover,
  .outArrow:hover {
    background: lightblue;
    border-radius: 180px;
  }

  .inArrow.selected,
  .outArrow.selected {
    background: lightblue;
    border-radius: 180px;
  }

  .label {
    text-align: center;
    font-style: italic;
    font-weight: bold;
    padding-bottom: 4px;
    border-bottom: 1px solid black;
    margin-bottom: 8px;
  }
</style>
