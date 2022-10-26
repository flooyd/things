<script>
  import { functions, addFunction, objects, objectColors } from "../../util";
  import {
    clickedElement,
    toolbarOpenStyle,
    functionsTooltipOpen,
    width,
    height,
  } from "../../stores/globals";
  import { tick } from "svelte";
  import { fly } from "svelte/transition";

  let hovered = null;

  const click = async (item) => {
    let createdFunction = await addFunction(
      $clickedElement._id,
      item,
      $width / 2,
      150
    );
    if (createdFunction) {
      createdFunction = {
        _id: createdFunction._id,
        name: createdFunction.name,
        elementId: $clickedElement._id,
        rect: {
          x: createdFunction.rectX,
          y: createdFunction.rectY,
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
        isVariable: createdFunction.isVariable,
      };
      $clickedElement.grid.functions.push(createdFunction);
      $clickedElement.grid.functions = $clickedElement.grid.functions;
    }
  };

  const setHovered = async (item) => {
    hovered = item;
    await tick();
  };
</script>

<div
  class="functionsTooltip"
  style={$toolbarOpenStyle}
  transition:fly={{ duration: 75, x: -500 }}
>
  <div class="header">
    <div class="headerTitle">
      <span>Functions</span>
      <i class="fa-solid fa-robot" />
    </div>
    <button
      class="headerClose"
      on:click={() => ($functionsTooltipOpen = false)}
    >
      <i class="fa-solid fa-times" />
    </button>
    <div class="headerDivider" />
  </div>
  <div class="description">
    <span>Functions are the building blocks of your app.</span>
    <span>
      They are the actions that happen when a user interacts with your app.
    </span>
    <span>
      You can add functions to your app by clicking on the buttons below.
    </span>
  </div>
  {#each Object.keys(functions) as item, i (item)}
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
        {:else if objects[item] === "element"}
          <i class="fa-solid fa-square" />
        {/if}
        <div class="functionName">{item}</div>
      </div>
      <div class="functionType">{functions[item]}</div>
    </div>
  {/each}
  <div class="divider">Hello</div>
</div>

<style>
  .functionsTooltip {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 8px;
    min-width: 400px;
    max-width: 400px;
    height: 100%;
    background: white;
    font-size: 13px;
    padding: 0px 13px;
    overflow-y: auto;
    color: black;
    z-index: 200;
    left: calc(100vw - 433px);
    overflow-x: auto;
    pointer-events: all;
    border-right: 3px solid blue;
    opacity: 0.95;
  }

  .functionsTooltip::-webkit-scrollbar {
    width: 0px;
  }

  .function {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    border-radius: 5px;
    border: 3px solid black;
  }

  .function:hover {
    cursor: pointer;
  }

  .header {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 8px;
    color: blue;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    background: white;
    top: 0px;
    padding: 13px 0px;
    flex-wrap: wrap;
  }

  .headerTitle {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .headerClose:hover {
    cursor: pointer;
    color: black;
    background: blue;
  }

  .header span {
    color: black;
  }

  .description {
    font-size: 13px;
    margin-bottom: 10px;
    line-height: 1.4;
  }

  .title {
    display: flex;
    justify-content: left;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    gap: 8px;
  }

  .divider {
    width: 100%;
    height: 30px;
    color: transparent;
  }

  .functionName {
    color: black;
  }

  .functionType {
    color: black;
  }

  .headerDivider {
    height: 3px;
    width: 100%;
    border-top: 3px solid blue;
    margin-top: 3px;
    color: transparent;
  }
</style>
