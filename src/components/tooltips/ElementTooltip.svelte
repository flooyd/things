<script>
  import {
    loading,
    elementTooltipId,
    childPendingDeletion,
    parentOfChildPendingDeletion,
    showGrid,
    toolbarOpenStyle,
    clickedElement,
  } from "../../stores/globals";
  import { deleteElement, updateElement } from "../../util";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import CSSEditor from "../CSSEditor.svelte";
  import {
    elements,
    elementUpdated,
    DOMScrollToOnOpen,
  } from "../../stores/elements";

  export let element;
  export let fromTree;
  export let handleEdit;
  export let handleSave;
  export let mouseInTooltip = null;

  let ready = false;
  let clientHeight;

  onMount(() => {
    setTimeout(() => {
      ready = true;
    }, 25);
  });

  $: clientHeight > 72 ? ($DOMScrollToOnOpen = element._id) : null;
  $: console.log(clientHeight);
</script>

<div
  bind:clientHeight
  on:click={(e) => {
    e.stopPropagation();
  }}
  class="elementTooltip"
  style={!fromTree ? $toolbarOpenStyle : ""}
  on:mouseenter={() => {
    if (fromTree) {
      console.log("mouse enter");
      $clickedElement = element;
      mouseInTooltip(element._id);
    }
  }}
  on:mouseleave={() => {
    if (fromTree) {
      mouseInTooltip(null);
    }
  }}
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
  </div>
  {#if ready}
    <div in:fade={{ duration: 50 }} class="toolbar">
      <button class="blueButton" on:click={() => handleSave()}>Save</button>
      <button
        type="button"
        on:click={async (e) => {
          e.stopPropagation();
          $elementTooltipId = null;
          const parentElement = $elements.find((el) =>
            el.parentOf.includes(element._id)
          );
          if (parentElement) {
            parentElement.parentOf = parentElement.parentOf.filter(
              (id) => id !== element._id
            );
            await updateElement(parentElement);
          }
          await deleteElement(element._id);
          $elementUpdated++;
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
    <div class="attributes">
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
          value={element._id}
        />
      </div>
      <div class="infoGroup">
        <label for="name" class="infoLabel">Element name</label>
        <input
          autocomplete="off"
          name="name"
          type="text"
          class="infoInput"
          value={element.name || ""}
          on:input={(e) => {
            if (e.target.value.includes(";")) {
              e.target.value = e.target.value.replace(";", "");
              return;
            }
            handleEdit("name", e.target.value);
          }}
        />
      </div>
      <div class="infoGroup">
        <label for="class" class="infoLabel">Element is child of</label>
        <input
          autocomplete="off"
          name="class"
          type="text"
          class="infoInput"
          value={element.childOf || ""}
          on:input={(e) => {
            if (e.target.value.includes(";")) {
              e.target.value = e.target.value.replace(";", "");
              return;
            }
            handleEdit("childOf", e.target.value);
          }}
        />
      </div>
      <div class="infoGroup">
        <label for="class" class="infoLabel">Element is parent Of</label>
        <input
          autocomplete="off"
          name="class"
          type="text"
          class="infoInput"
          value={element.parentOf}
          disabled={true}
        />
      </div>
    </div>
    <div class="cssEditor">
      <CSSEditor element={$clickedElement} {handleEdit} />
    </div>
    <div class="placeholder" />
  {/if}
</div>

<style @charset="utf-8">
  @import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap");

  .elementTooltip {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: calc(100% - 26px);
    background: white;
    font-size: 13px;
    padding: 0px 13px;
    overflow-y: scroll;
    color: black;
    z-index: 200;
    pointer-events: all;
    opacity: 0.95;
  }

  .header {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    width: 100%;
    align-items: center;
    gap: 8px;
    color: brown;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
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
    margin-bottom: 10px;
  }

  .infoGroup {
    display: flex;
    align-items: center;
  }

  .infoGroup label,
  .infoGroup input {
    width: 200px;
  }

  .infoGroup label {
    width: 232px;
  }

  .infoGroup input {
    padding: 5px;
    border: none;
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

  .cssEditor {
    margin-bottom: 10px;
  }

  .attributes {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
    background: brown;
    border-radius: 5px;
    padding: 8px;
  }
</style>
