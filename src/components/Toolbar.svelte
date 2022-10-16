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
  <div class="DOM">
    <button class="lightGreenButton" on:click={() => ($htmlTooltipOpen = true)}>
      HTML
    </button>
  </div>
  <div class="appTitle">Svelte App Editor</div>
  <div class="CODE">
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
    <button
      on:mousedown={() => ($storesTooltipOpen = !$storesTooltipOpen)}
      class="blueButton">stores</button
    >
    <button
      on:mousedown={() => ($functionsTooltipOpen = !$functionsTooltipOpen)}
      class="blueButton">functions</button
    >
  </div>
</div>

<style>
  .toolbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: fit-content;
    background: #111;
    padding: 10px 20px;
    z-index: 999;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .appTitle {
    font-size: 1.5rem;
    color: white;
    margin-left: 20px;
  }

  .CODE {
    margin-right: 40px;
  }
</style>
