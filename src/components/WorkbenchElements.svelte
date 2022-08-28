<script lang="ts">
  import { elementsOpen } from "../stores/tooltip.js";
  import { elements } from "../stores/elements";
  import { fade } from "svelte/transition";
  let x = 0;
  let y = 0;
  let width = 0;
  let height = 0;
  let element = null;
  let mounted = false;

  $: element ? (width = element.getClientRects()[0].width) : null;
  $: element ? (height = element.getClientRects()[0].height) : null;

  const addElement = (type) => {
    //switch on type, if type is div, add div, if type is button, add button, etc...format {type: "string"}
    $elements = [...$elements, { type: type }];
    console.log($elements);
  };
</script>

<div
  bind:offsetHeight={y}
  bind:offsetWidth={x}
  bind:clientHeight={height}
  bind:clientWidth={width}
  bind:this={element}
  class="item hoverable"
  on:mouseenter={() => {
    $elementsOpen = true;
  }}
  on:mouseleave={() => {
    $elementsOpen = false;
  }}
>
  <span class="hoverable-icon"><i class="fa-solid fa-code" /></span>
  <span class="hoverable-label">elements</span>
  {#if width && height && $elementsOpen}
    <div transition:fade={{ duration: 75 }} class="tooltip">
      <div class="tooltip-item" on:click={() => addElement("div")}>div</div>
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
    top: 30px;
    left: -2px;
    background: var(--rich-black-fogra-29);
    border-bottom: 3px solid var(--shadow-blue);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: left;
    gap: 13px;
    flex-wrap: wrap;
    padding: 13px;
    color: var(--cultured);
  }

  .tooltip-item:hover {
    color: var(--shadow-blue);
  }
</style>
