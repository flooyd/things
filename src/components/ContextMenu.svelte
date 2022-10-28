<script>
  import {
    contextElement,
    childAssignmentPending,
    showToolbar,
  } from "../stores/globals";
  import { updateElement } from "../util";
  import { elements, elementsPendingUpdate } from "../stores/elements";
  import { fly, fade } from "svelte/transition";

  let topOrBottom = "bottom";
</script>

<div
  class={`contextMenu ${topOrBottom} ${
    $showToolbar ? "toolbarOpen" : "toolbarClosed"
  }`}
  in:fly={{ x: -500, duration: 300 }}
  out:fly={{ x: -500, duration: 300 }}
>
  <div class="features">
    <button
      class="brownButton"
      on:click={() => ($childAssignmentPending = !$childAssignmentPending)}
    >
      {#if $childAssignmentPending}
        Cancel
      {:else}
        Assign as Child
      {/if}
    </button>
    <button
      class="brownButton"
      on:click={async () => {
        $elements.find((el) => el._id === $contextElement._id).childOf = null;
        await updateElement($contextElement);
        $elementsPendingUpdate = true;
        $elements = $elements;
      }}>Remove as Child</button
    >
    <button class="redButton">Delete</button>
  </div>
  <div class="info">
    {#if $contextElement}
      <span transition:fade>{$contextElement._id}</span>
    {/if}
    <button
      class="threethreesbutton"
      on:click={() => {
        if (topOrBottom === "bottom") {
          topOrBottom = "top";
        } else {
          topOrBottom = "bottom";
        }
      }}
    >
      {#if topOrBottom === "bottom"}
        <span>▲</span>
      {:else}
        <span>▼</span>
      {/if}
    </button>
  </div>
</div>

<style>
  .contextMenu {
    padding: 10px 20px;
    width: calc(100vw - 40px);
    background: white;
    position: absolute;
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .top {
    top: 0px;
    border-bottom: 3px solid black;
  }

  .top.toolbarOpen {
    top: 49px;
  }

  .bottom {
    bottom: 0px;
    border-top: 3px solid black;
  }

  .info {
    font-size: 13px;
    display: flex;
    gap: 8px;
    align-items: center;
  }
</style>
