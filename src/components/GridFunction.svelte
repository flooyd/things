<script>
  import { onMount } from "svelte";
  import {
    clickedElement,
    outArrowClicked,
    inArrowClicked,
    draggableMoving,
    functionMoving,
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

  onMount(() => {
    numOutputs = functionOutputs[gridFunction.name]?.count || 0;
    numInputs = functionInputs[gridFunction.name]?.count || 0;
    typeOfOutput = functionOutputs[gridFunction.name]?.type || "any";
    typeOfInput = functionInputs[gridFunction.name]?.type || "any";
    typeOfInputTwo = functionInputs[gridFunction.name]?.type2 || null;
    console.log(
      gridFunction.name,
      numOutputs,
      numInputs,
      typeOfOutput,
      typeOfInput
    );
    ready = true;
  });

  //total function size = 72px
  //divided by 2 = 36px
  //function top padding  = 6px;
  //function bottom padding = 6px;
  //label size = 26px
  //including top padding = 32px
  //top element  = 30px;
  //what is the center y of the top element factoring in all the padding and label size?
  //72 - 6 - 15 = 51

  const setRect = () => {
    rect = element.getBoundingClientRect();
    rect.x = rect.x - gridRect.x;
    rect.y = rect.y - gridRect.y;

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
    e.stopPropagation();
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
  }, 25);

  $: element ? setRect() : null;
  $: console.log("gridFunction", gridFunction);
</script>

<svelte:window
  on:mouseup={() => {
    setRect();
    $draggableMoving = false;
  }}
/>
{#if ready}
  <div
    on:mouseenter={() => {
      $functionMoving = gridFunction._id;
    }}
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
          on:click={(e) => handleClickArrow("in", e)}
        >
          ▶
        </div>
      {/if}
      <div class="gridFunctionName">{gridFunction.name}</div>
      <div
        class="outArrow"
        on:focus
        on:click={(e) => handleClickArrow("out", e)}
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
    z-index: 5000;
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
