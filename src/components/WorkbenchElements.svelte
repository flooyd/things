<script>
  import { fade } from "svelte/transition";
  let x = 0;
  let y = 0;
  let width = 0;
  let height = 0;
  let element = null;
  let mounted = false;

  $: element ? (width = element.getClientRects()[0].width) : null;
  $: element ? (height = element.getClientRects()[0].height) : null;
  width = 100;
</script>

<div
  bind:offsetHeight={y}
  bind:offsetWidth={x}
  bind:clientHeight={height}
  bind:clientWidth={width}
  bind:this={element}
  class="item hoverable"
>
  <span class="hoverable-icon"><i class="fa-solid fa-code" /></span>
  <span class="hoverable-label">elements</span>
  {#if width && height}
    <div
      transition:fade={{ delay: 1750, duration: 500 }}
      class="tooltip"
      style="min-width: {width - 6}px; min-height: {height}px;"
    >
      <div class="tooltip-item">div</div>
      <div class="tooltip-item">span</div>
      <div class="tooltip-item">p</div>
      <div class="tooltip-item">a</div>
      <div class="tooltip-item">section</div>
      <div class="tooltip-item">form</div>
      <div class="tooltip-item">img</div>
      <div class="tooltip-item">input</div>
      <div class="tooltip-item">button</div>
      <div class="tooltip-item">select</div>
      <div class="tooltip-item">option</div>
      <div class="tooltip-item">textarea</div>
      <div class="tooltip-item">label</div>
      <div class="tooltip-item">main</div>
      <div class="tooltip-item">header</div>
      <div class="tooltip-item">footer</div>
      <div class="tooltip-item">nav</div>
      <input placeholder="any other tag..." />
      <button>Add</button>
    </div>
  {/if}
</div>

<style>
  .item {
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    padding: 5px 2px;
    border: 3px solid var(--oxford-blue);
    cursor: pointer;
    background: var(--cultured);
    max-height: 30px;
    width: 125px;
  }

  .tooltip {
    position: absolute;
    top: 32px;
    left: -2px;
    background: var(--rich-black-fogra-29);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: left;
    gap: 16px;
    width: 330px;
    flex-wrap: wrap;
    padding: 13px;
    color: var(--cultured);
  }

  .tooltip-item:hover {
    color: var(--shadow-blue);
  }
</style>
