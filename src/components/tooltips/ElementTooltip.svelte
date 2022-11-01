<script>
  import {
    loading,
    elementTooltipId,
    childPendingDeletion,
    parentOfChildPendingDeletion,
    showGrid,
    toolbarOpenStyle,
  } from "../../stores/globals";
  import { deleteElement, cssObject } from "../../util";
  import { fly, fade } from "svelte/transition";

  export let element;
  export let handleEdit;
  export let handleSave;
</script>

<div
  on:click={(e) => {
    e.stopPropagation();
  }}
  class="elementTooltip"
  style={$toolbarOpenStyle}
  in:fly={{ duration: 75, x: -500 }}
  out:fade={{ duration: 75 }}
>
  <div class="header">
    <div class="headerTitle">
      <span>Element</span>
      <i class="fa fa-code" />
    </div>
    <button class="headerClose" on:click={() => ($elementTooltipId = null)}>
      <i class="fa-solid fa-times" />
    </button>
    <div class="headerDivider" />
    <div class="toolbar">
      <button class="blueButton" on:click={() => handleSave()}>Save</button>
      <button
        type="button"
        on:click={async (e) => {
          e.stopPropagation();
          $elementTooltipId = null;
          await deleteElement(element._id);
          $childPendingDeletion = element._id;
          $parentOfChildPendingDeletion = element.childOf;
        }}
        disabled={$loading}
        class="redButton">Delete Element</button
      >
      <button
        on:click={() => ($showGrid = !$showGrid)}
        class="blueButton"
        type="button"
        >{#if $showGrid}Close{:else}Open{/if} Grid</button
      >
    </div>
  </div>
  <div class="infoGroup">
    <label for="type" class="infoLabel">Element type</label>
    <input
      name="type"
      type="text"
      class="infoInput"
      disabled
      value={element.type}
    />
  </div>
  <div class="infoGroup">
    <label for="id" class="infoLabel">Element id</label>
    <input
      name="id"
      type="text"
      class="infoInput"
      disabled
      value={element.id}
    />
  </div>
  <div class="infoGroup">
    <label for="name" class="infoLabel">Element name</label>
    <input
      autocomplete="off"
      name="name"
      type="text"
      class="infoInput"
      value={element.name}
      on:input={(e) => {
        handleEdit("name", e.target.value);
      }}
    />
  </div>

  {#each cssObject.css as property}
    <div class="infoGroup">
      <label for={property} class="infoLabel">
        {property}
      </label>
      <input
        autocomplete="off"
        name={property}
        type="text"
        class="infoInput"
        value={element[property] || ""}
        on:input={(e) => {
          handleEdit("style", { [property]: e.target.value });
        }}
      />
    </div>
  {/each}
  {#each cssObject.experimental as property}
    <div class="infoGroup">
      <label for={property} class="infoLabel">
        {property}
      </label>
      <i class="fa fa-flask" />
      <input
        autocomplete="off"
        name={property}
        type="text"
        class="infoInput"
        value={element[property] || ""}
        on:input={(e) => {
          handleEdit("style", { [property]: e.target.value });
        }}
      />
    </div>
  {/each}
  <div class="placeholder" />
</div>

<style @charset="utf-8">
  @import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap");

  .elementTooltip {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 400px;
    max-width: 400px;
    background: white;
    font-size: 13px;
    padding: 0px 13px;
    overflow-y: auto;
    color: black;
    z-index: 200;
    pointer-events: all;
    opacity: 0.95;
  }

  .header {
    font-size: 20px;
    margin-bottom: 10px;
    font-weight: bold;
    display: flex;
    width: 100%;
    align-items: center;
    gap: 8px;
    color: brown;
    justify-content: space-between;
    align-items: center;
    padding: 13px 0px;
    flex-wrap: wrap;
    position: sticky;
    top: 0px;
    background: white;
    pointer-events: all;
  }

  .headerTitle {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .headerTitle span {
    color: black;
  }

  .headerClose:hover {
    cursor: pointer;
    background: brown;
    color: black;
  }

  .elementTooltip::-webkit-scrollbar {
    width: 8px;
  }

  .elementTooltip::-webkit-scrollbar-thumb {
    background: brown;
  }

  .toolbar {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: left;
    flex-wrap: wrap;
    width: 100%;
  }

  .infoGroup {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
  }

  .infoGroup:hover {
    background: var(--shadow-blue);
  }

  .headerDivider {
    height: 3px;
    width: 100%;
    border-top: 3px solid brown;
    margin-top: 3px;
    color: transparent;
  }
</style>
