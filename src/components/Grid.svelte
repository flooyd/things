<script>
  import { onMount } from "svelte";
  import {
    storesTooltipOpen,
    functionsTooltipOpen,
    clickedElement,
  } from "../stores/globals";
  import Draggable from "./Draggable.svelte";
  import GridFunction from "./GridFunction.svelte";

  let element = null;
  let rect = null;

  onMount(() => {
    rect = element.getBoundingClientRect();
  });

  setInterval(() => {
    rect = element.getBoundingClientRect();
  }, 500);
</script>

<div class="grid" bind:this={element}>
  <div class="toolbar">
    <div class="id">
      {$clickedElement.name
        ? $clickedElement._id + " - " + $clickedElement.name
        : $clickedElement._id}
    </div>
    <button
      on:click={() => ($storesTooltipOpen = !$storesTooltipOpen)}
      class="blueButton">stores</button
    >
    <button
      on:click={() => ($functionsTooltipOpen = !$functionsTooltipOpen)}
      class="blueButton">functions</button
    >
  </div>
  {#if $clickedElement.grid}
    {#each $clickedElement.grid.functions as item}
      <Draggable>
        <GridFunction gridRect={rect} gridFunction={item} />
      </Draggable>
    {/each}
  {/if}
</div>

<style>
  .grid {
    height: 100vh;
    font-size: 13px;
    overflow-y: auto;
    overflow-x: auto;
    color: black;
    z-index: 200;
    pointer-events: all;
    flex-grow: 1;
    background-image: linear-gradient(to right, grey 1px, transparent 1px),
      linear-gradient(to bottom, grey 1px, white 1px);
    background-size: 20px 20px;
    position: relative;
  }

  .toolbar {
    width: 100%;
    height: 30px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 13px;
    pointer-events: none;
  }

  .toolbar button {
    margin-right: 13px;
    pointer-events: all;
  }

  .id {
    margin-right: 13px;
    font-size: 16px;
    font-weight: bold;
    padding: 5px 8px;
    border-radius: 5px;
    background: white;
    border: 2px solid black;
  }
</style>
