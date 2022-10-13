<script>
  import {
    functions,
    fetchFunctionsForElement,
    addFunction,
    addDirtyFunction,
  } from "../../util";
  import { clickedElement, dirtyFunctions } from "../../stores/globals";
  import { onMount } from "svelte";

  let clickedElementFunctions = [];

  onMount(async () => {
    clickedElementFunctions = await fetchFunctionsForElement(
      $clickedElement._id
    );
  });

  const click = async (item) => {
    let createdFunction = await addFunction($clickedElement._id, item);
    if (createdFunction) {
      createdFunction = {
        _id: createdFunction._id,
        name: createdFunction.name,
        elementId: $clickedElement._id,
        rect: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          inArrowLocation: {
            x: 0,
            y: 0,
          },
          outArrowLocation: {
            x: 0,
            y: 0,
          },
        },
      };
      addDirtyFunction(createdFunction._id);
      $clickedElement.grid.functions.push(createdFunction);
      $clickedElement.grid.functions = $clickedElement.grid.functions;
    }
  };
</script>

<div class="functionsTooltip">
  <div class="header">Functions</div>
  {#each Object.keys(functions) as item}
    <div
      on:click={() => {
        click(item);
      }}
      class="function"
    >
      <div class="title">
        <img src="images/function.png" alt="function" />
        <div class="functionName">{item}</div>
      </div>
      <div class="functionType">{functions[item]}</div>
    </div>
  {/each}
</div>

<style>
  .functionsTooltip {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: fit-content;
    min-width: 400px;
    height: calc(100vh - 20px);
    background: white;
    font-size: 13px;
    padding: 16px;
    overflow-y: auto;
    color: black;
    z-index: 200;
    left: calc(100vw - 433px);
    overflow-x: auto;
    pointer-events: all;
  }

  .function {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    border-radius: 5px;
    border: 2px solid black;
  }

  .header {
    font-size: 20px;
    font-weight: bold;
    color: var(--oxford-blue);
  }

  .function:hover {
    background: var(--oxford-blue);
    color: white;
    cursor: pointer;
  }

  .title {
    display: flex;
    justify-content: left;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
  }

  img {
    margin-right: 8px;
    background: white !important;
    padding: 5px;
  }
</style>
