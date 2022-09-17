<script lang="ts">
  import { elementsOpen } from "../stores/tooltip.js";
  import { elements } from "../stores/elements";
  import { fade } from "svelte/transition";
  import { addDoc, collection, getDoc } from "firebase/firestore";
  import { db, awaitingFirebase } from "../stores/globals.js";
  import { addElement } from "../util.js";
  let x = 0;
  let y = 0;
  let width = 0;
  let height = 0;
  let element = null;

  $: element ? (width = element.getClientRects()[0].width) : null;
  $: element ? (height = element.getClientRects()[0].height) : null;
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
    <div transition:fade={{ duration: 50 }} class="tooltip">
      <button
        disabled={$awaitingFirebase}
        class="tooltip-item"
        on:click={() => addElement("div")}>div</button
      >
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
    gap: 31px;
    flex-wrap: wrap;
    padding: 13px 20px;
    color: var(--cultured);
    width: 300px;
    z-index: 100;
  }
</style>
