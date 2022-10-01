<script>
  import { fly } from "svelte/transition";
  import { functions } from "../../util";
</script>

<div class="functionsTooltip" transition:fly={{ x: 500, y: 0, duration: 100 }}>
  {#each Object.keys(functions) as item}
    <div class="function">
      <div class="functionHeader">
        <div class="functionName">{item}</div>
        <div class="functionType">{functions[item]}</div>
      </div>
    </div>
  {/each}
</div>

<style>
  .functionsTooltip {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: fixed;
    right: auto;
    width: fit-content;
    min-width: 400px;
    height: calc(100vh - 100px);
    max-height: calc(100vh - 100px);
    background: white;
    border: 3px solid var(--oxford-blue);
    font-size: 13px;
    padding: 16px;
    overflow-y: auto;
    border-radius: 5px;
    color: black;
    z-index: 200;
    left: calc(100vw - 433px);
    top: -3px;
    overflow-x: auto;
  }
</style>
