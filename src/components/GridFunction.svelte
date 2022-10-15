<script>
  import { onMount } from "svelte";
  import {
    clickedElement,
    outArrowClicked,
    inArrowClicked,
    draggableMoving,
    functionMoving,
  } from "../stores/globals";
  import { classesAndObjects, executables, functionOutputs } from "../util";

  export let gridFunction;
  export let gridRect;
  let element = null;
  let rect = null;
  let numOutputs = 0;
  let numInputs = 0;
  let typeOfInput;
  let typeOfOutput;
  let ready = false;

  onMount(() => {
    console.log(gridFunction.name);
    numOutputs = functionOutputs[gridFunction.name]?.count || 0;
    numInputs = classesAndObjects[gridFunction.name]?.count || 0;
    typeOfOutput = functionOutputs[gridFunction.name]?.type || "any";
    typeOfInput = classesAndObjects[gridFunction.name]?.type || "any";
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
    console.log("inArrowLocation", inArrowLocation);
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
  $: rect ? console.log("gridFunctionRect", rect) : null;
</script>

<svelte:window
  on:mouseup={() => {
    setRect();
    $draggableMoving = false;
  }}
/>
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
    {classesAndObjects[gridFunction.name]}
  </div>
  <div class="top">
    {#if executables.includes(gridFunction.name)}
      <div class="inArrow" on:focus on:click={(e) => handleClickArrow("in", e)}>
        ▶
      </div>
    {/if}
    <div class="gridFunctionName">{gridFunction.name}</div>
    <div class="outArrow" on:focus on:click={(e) => handleClickArrow("out", e)}>
      ▶
    </div>
  </div>
  <div class="outputs">
    {#each Array(numOutputs) as _, i}
      <div class="output">
        <div class="outputCircle">
          <span class="outputCircleType">{typeOfOutput}</span>
          <i class="fas fa-circle" />
        </div>
      </div>
    {/each}
  </div>
  <div class="inputs">
    {#each Array(numInputs) as _, i}
      <div class="input">
        <div class="inputCircle">
          <span class="inputCircleType">{typeOfInput}</span>
          <i class="fas fa-circle" />
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .gridFunction {
    min-width: 75px;
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

  .outputSpan {
    margin-right: 8px;
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

  .inputSpan {
    margin-left: 8px;
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
