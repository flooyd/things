<script>
  import {
    functions,
    fetchFunctionsForElement,
    addFunction,
    addDirtyFunction,
    objects,
    objectColors,
  } from "../../util";
  import { clickedElement, dirtyFunctions } from "../../stores/globals";
  import { onMount, tick } from "svelte";

  let clickedElementFunctions = [];
  let hovered = null;

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

  const setHovered = async (item) => {
    hovered = item;
    await tick();
  };

  $: console.log(hovered);
</script>

<div class="functionsTooltip">
  <div class="header">Functions</div>
  {#each Object.keys(functions) as item (item)}
    <div
      on:click={() => {
        click(item);
      }}
      on:mouseover={() => {
        setHovered(item);
      }}
      on:focus={() => {
        setHovered(item);
      }}
      on:mouseleave={() => {
        setHovered(null);
      }}
      class={`function ${objectColors[objects[item]]}`}
    >
      <div
        class="title"
        style={hovered === item
          ? "color: black"
          : "color: " + objectColors[objects[item]]}
      >
        {#if objects[item] === "lifecycle"}
          <i class="fa-solid fa-arrows-rotate" />
          <img src="images/function.png" alt="function" />
        {:else if objects[item] === "console"}
          <i class="fa-solid fa-terminal" />
          <img src="images/function.png" alt="function" />
        {:else if objects[item] === "document"}
          <i class="fa-solid fa-file" />
          <img src="images/function.png" alt="function" />
        {:else if objects[item] === "event"}
          <i class="fa-solid fa-mouse-pointer" />
          <img src="images/function.png" alt="function" />
        {:else if objects[item] === "variable"}
          <i class="fa-solid fa-database" />
          <img src="images/function.png" alt="function" />
        {:else if objects[item] === "conditional"}
          <i class="fa-solid fa-code" />
          <img src="images/function.png" alt="function" />
        {:else if objects[item] === "math"}
          <i class="fa-solid fa-calculator" />
          <img src="images/function.png" alt="function" />
        {:else if objects[item] === "loop"}
          <i class="fa-solid fa-repeat" />
          <img src="images/function.png" alt="function" />
        {:else if objects[item] === "logic"}
          <i class="fa-solid fa-microchip" />
          <img src="images/function.png" alt="function" />
        {:else if objects[item] === "jump"}
          <i class="fa-solid fa-arrow-right" />
        {:else if objects[item] === "return"}
          <i class="fa-solid fa-arrow-left" />
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

  .function:hover {
    cursor: pointer;
  }

  .header {
    font-size: 20px;
    margin-top: 20px;
    font-weight: bold;
  }

  .title {
    display: flex;
    justify-content: left;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    gap: 8px;
  }

  .function.green:hover {
    background: green;
  }

  .function.red:hover {
    background: red;
  }

  .function.blue:hover {
    background: blue;
  }

  .function.yellow:hover {
    background: yellow;
  }

  .function.purple:hover {
    background: purple;
  }

  .function.orange:hover {
    background: orange;
  }

  .function.pink:hover {
    background: pink;
  }

  .function.cyan:hover {
    background: cyan;
  }

  .function.gray:hover {
    background: gray;
  }

  .function.teal:hover {
    background: teal;
  }

  .functionName {
    color: black;
  }

  .functionType {
    color: black;
  }
</style>
