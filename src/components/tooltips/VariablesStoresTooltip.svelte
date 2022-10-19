<script>
  import {} from "../../util";
  import {
    toolbarOpenStyle,
    variablesStoresTooltipOpen,
  } from "../../stores/globals";
  import { onMount } from "svelte";

  onMount(async () => {});
</script>

<div class="variablesStoresTooltip" style={$toolbarOpenStyle}>
  <div class="header">
    <div class="headerTitle">
      <span>Variables and Stores</span>
      <i class="fa-solid fa-box" />
    </div>
    <button
      class="headerClose"
      on:click={() => ($variablesStoresTooltipOpen = false)}
    >
      <i class="fa-solid fa-times" />
    </button>
    <div class="headerDivider" />
  </div>
  <div class="description">
    <span>
      Variables and stores are used to store data. Variables are used to store
      data that is only used in the current element/component. Stores are used
      to store data that is used across the entire app (or multiple
      elements/components).
    </span>
  </div>
</div>

<style>
  .variablesStoresTooltip {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 8px;
    min-width: 400px;
    max-width: 400px;
    height: 100%;
    background: white;
    font-size: 13px;
    padding: 0px 13px;
    overflow-y: auto;
    color: black;
    z-index: 200;
    left: calc(100vw - 433px);
    overflow-x: auto;
    pointer-events: all;
    border-right: 3px solid orange;
    opacity: 0.95;
  }

  .variablesStoresTooltip::-webkit-scrollbar {
    width: 0px;
  }

  .header {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 8px;
    color: orange;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    background: white;
    top: 0px;
    padding: 13px 0px;
    flex-wrap: wrap;
  }

  .headerTitle {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .headerClose:hover {
    cursor: pointer;
    color: black;
    background: orange;
  }

  .header span {
    color: black;
  }

  .description {
    font-size: 13px;
    margin-bottom: 10px;
    line-height: 1.4;
  }

  .headerDivider {
    height: 3px;
    width: 100%;
    border-top: 3px solid orange;
    margin-top: 3px;
    color: transparent;
  }
</style>
