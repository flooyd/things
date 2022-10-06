<script>
  import { onMount } from "svelte";
  import { clickedElement, outArrowClicked } from "../stores/globals";

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
      (f) => f.name === gridFunction.name
    ).rect = {
      x: rect.x,
      y: rect.y,
      inArrowLocation,
      outArrowLocation,
    };
    $clickedElement = $clickedElement;
  };

  const handleClickArrow = (type) => {
    if (type === "out") {
      $outArrowClicked = gridFunction.id;
    }
  };

  $: console.log($outArrowClicked);
</script>

<div
  on:mouseenter={setRect}
  on:mouseup={setRect}
  class="gridFunction"
  bind:this={element}
>
  <div class="label">
    {gridFunction.class}
  </div>
  <div class="top">
    {#if gridFunction.executable}
      <div class="inArrow" on:focus on:click={() => handleClickArrow("in")}>
        ▶
      </div>
    {/if}
    <div class="gridFunctionName">{gridFunction.name}</div>
    <div class="outArrow" on:focus on:click={() => handleClickArrow("out")}>
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
