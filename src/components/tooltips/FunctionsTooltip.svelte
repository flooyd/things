<script>
  import { fly } from "svelte/transition";
  import { functions } from "../../util";
</script>

<div class="functionsTooltip" transition:fly={{ x: 500, y: 0, duration: 100 }}>
  <div class="header">Functions</div>
  {#each Object.keys(functions) as item}
    <div class="function">
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
    height: calc(100vh - 36px);
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
