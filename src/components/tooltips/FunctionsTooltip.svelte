<script>
  import { functions, executables, classesAndObjects, getId } from "../../util";
  import { clickedElement } from "../../stores/globals";

  const click = (item) => {
    if ($clickedElement) {
      console.log($clickedElement);
      typeof $clickedElement.grid === "object"
        ? null
        : ($clickedElement.grid = { functions: [] });
      if ($clickedElement.grid.functions.find((f) => f.name === item)) return;
      $clickedElement.grid.functions.push({
        name: item,
        x: 0,
        y: 0,
        executable: executables.includes(item),
        class: classesAndObjects[item] || null,
        id: getId(),
      });
    }
    $clickedElement = $clickedElement;
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
