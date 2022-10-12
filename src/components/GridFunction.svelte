<script>
  import {
    clickedElement,
    outArrowClicked,
    inArrowClicked,
    draggableMoving,
    functionMoving,
  } from "../stores/globals";
  import { classesAndObjects, executables } from "../util";

  export let gridFunction;
  export let gridRect;
  let element = null;
  let rect = null;

  const setRect = () => {
    rect = element.getBoundingClientRect();
    rect.x = rect.x - gridRect.x;
    rect.y = rect.y - gridRect.y;

    const inArrowLocation = {
      x: rect.left + 10,
      y: rect.top + rect.height / 2,
    };
    const outArrowLocation = {
      x: rect.left + rect.width - 10,
      y: rect.top + rect.height / 2,
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
</script>

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
  on:mouseup={() => {
    setRect();
    $functionMoving = null;
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
</div>

<style>
  .gridFunction {
    min-width: 75px;
    padding: 5px;
    border: 2px solid black;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    background: #ccc;
  }

  .top {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    gap: 8px;
  }

  .inArrow,
  .outArrow {
    cursor: pointer;
    padding: 5px;
  }

  .label {
    text-align: center;
    font-style: italic;
    font-weight: bold;
    padding-bottom: 3px;
    border-bottom: 1px solid black;
    margin-bottom: 8px;
  }
</style>
