<script>
  import {
    functions,
    fetchFunctionsForElement,
    addFunction,
    addDirtyFunction,
    classesAndObjects,
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
        {#if classesAndObjects[item] === "lifecycle"}
          <i class="fa-solid fa-arrows-rotate" />
          <img src="images/function.png" alt="function" />
        {:else if classesAndObjects[item] === "console"}
          <i class="fa-solid fa-terminal" />
          <img src="images/function.png" alt="function" />
        {:else if classesAndObjects[item] === "document"}
          <i class="fa-solid fa-file" />
          <img src="images/function.png" alt="function" />
        {:else if classesAndObjects[item] === "event"}
          <i class="fa-solid fa-mouse-pointer" />
          <img src="images/function.png" alt="function" />
        {/if}
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
    min-width: 400px;
    max-width: 400px;
    height: 100%;
    background: white;
    font-size: 13px;
    padding: 0px 10px;
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
    margin-top: 20px;
    font-weight: bold;
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
    gap: 8px;
  }
</style>
