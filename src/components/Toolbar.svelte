<script lang="ts">
  import {
    variablesStoresModalOpen,
    functionsModalOpen,
    elementOnTheFrontBurner,
    componentOnTheFrontBurner,
    htmlModalOpen,
    showGrid,
  } from "../stores/globals";
  import { visualizeDOM, elementOpenedInDOM } from "../stores/elements";
</script>

<div class="toolbar">
  <div class="appTitle">SAE</div>
  <div class="CODE">
    <button
      class="lightGreenButton"
      on:click={() => ($htmlModalOpen = !$htmlModalOpen)}
    >
      HTML
    </button>
    <button class="redButton"> CSS </button>
    <button
      on:mousedown={() => ($functionsModalOpen = !$functionsModalOpen)}
      class="blueButton">Functions</button
    >
    <button
      on:mousedown={() =>
        ($variablesStoresModalOpen = !$variablesStoresModalOpen)}
      class="orangeButton">Variables/Stores/Components</button
    >
    {#if $elementOnTheFrontBurner}
      <button
        class="id brownButton"
        on:mousedown={(e) => {
          e.stopPropagation();
          $elementOpenedInDOM = $elementOnTheFrontBurner._id;
          $visualizeDOM = true;
        }}
      >
        {$elementOnTheFrontBurner.name
          ? $elementOnTheFrontBurner._id + " - " + $elementOnTheFrontBurner.name
          : $elementOnTheFrontBurner._id}
      </button>
    {/if}
    <button
      on:click={() => {
        $visualizeDOM = !$visualizeDOM;
        $elementOpenedInDOM = null;
      }}
      class="threethreesbutton"
    >
      {$visualizeDOM ? "Hide DOM" : "Show DOM"}
    </button>
    {#if $showGrid}
      <button
        class="threethreesbutton"
        on:click={() => {
          $visualizeDOM = false;
          $showGrid = false;
          $componentOnTheFrontBurner = null;
        }}
      >
        Close Grid
      </button>
    {:else}
      <button
        class="threethreesbutton"
        on:click={() => {
          $visualizeDOM = false;
          $componentOnTheFrontBurner = {
            componentName: $elementOnTheFrontBurner.componentName,
          };
          $showGrid = true;
        }}
      >
        Open Grid
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
    opacity: 0.9;
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
