<script lang="ts">
  import {
    storesTooltipOpen,
    functionsTooltipOpen,
    clickedElement,
    elementTooltipId,
    htmlTooltipOpen,
  } from "../stores/globals";

  const handleClickId = (e) => {
    $elementTooltipId === $clickedElement._id
      ? ($elementTooltipId = null)
      : ($elementTooltipId = $clickedElement._id);
  };
</script>

<div class="toolbar">
  <div class="appTitle">Svelte App Editor</div>
  <div class="CODE">
    <button
      class="lightGreenButton"
      on:click={() => ($htmlTooltipOpen = !$htmlTooltipOpen)}
    >
      HTML
    </button>
    <button class="redButton"> CSS </button>
    <button
      on:mousedown={() => ($functionsTooltipOpen = !$functionsTooltipOpen)}
      class="blueButton">Functions</button
    >
    <button
      on:mousedown={() => ($storesTooltipOpen = !$storesTooltipOpen)}
      class="orangeButton">Variables and Stores</button
    >
    {#if $clickedElement}
      <button
        class="id blueButton"
        on:mousedown={(e) => {
          handleClickId(e);
        }}
      >
        {$clickedElement.name
          ? $clickedElement._id + " - " + $clickedElement.name
          : $clickedElement._id}
      </button>
    {/if}
  </div>
</div>

<style>
  .toolbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: fit-content;
    background: white;
    padding: 10px 20px;
    z-index: 99999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.5);
    border-bottom: 3px solid black;
  }

  .appTitle {
    font-size: 1.5rem;
    color: black;
    align-self: center;
  }

  .CODE {
    margin-right: 40px;
  }
</style>
