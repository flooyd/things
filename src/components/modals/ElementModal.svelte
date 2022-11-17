<script>
  import {
    childPendingDeletion,
    parentOfChildPendingDeletion,
    showGrid,
    toolbarOpenStyle,
    elementOnTheFrontBurner,
  } from "../../stores/globals";
  import { deleteElement, updateElement } from "../../util";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import CSSEditor from "../CSSEditor.svelte";
  import {
    elements,
    elementUpdated,
    DOMReadyToScroll,
    elementOpenedInDOM,
  } from "../../stores/elements";

  export let element;
  export let fromTree;
  export let handleEdit;
  export let mouseInModal = null;

  let ready = false;
  let clientHeight;

  onMount(() => {
    setTimeout(() => {
      ready = true;
    }, 25);
  });

  const handleCloseModal = () => {
    $elementOnTheFrontBurner = null;
    $elementOpenedInDOM = null;
  };

  $: clientHeight > 72 ? $DOMReadyToScroll++ : null;
</script>

<div
  bind:clientHeight
  on:click={(e) => {
    e.stopPropagation();
  }}
  class="elementModal"
  style={!fromTree ? $toolbarOpenStyle : ""}
  on:mouseenter={() => {
    if (fromTree) {
      $elementOnTheFrontBurner = element;
      mouseInModal(element._id);
    }
  }}
  on:mouseleave={() => {
    if (fromTree) {
      mouseInModal(null);
    }
  }}
>
  <div class="header">
    <div class="headerTitle">
      <span>Element</span>
      <i class="fa fa-code" />
    </div>
    <button class="headerClose" on:click={handleCloseModal}>
      <i class="fa-solid fa-times" />
    </button>
    <div class="headerDivider" />
  </div>
  {#if ready && $elementOnTheFrontBurner}
    <div in:fade={{ duration: 50 }} class="toolbar">
      <button
        type="button"
        on:click={async (e) => {
          e.stopPropagation();
          $elementOnTheFrontBurner = null;
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
      <CSSEditor element={$elementOnTheFrontBurner} {handleEdit} />
    </div>
    <div class="placeholder" />
  {/if}
</div>

<style @charset="utf-8">
  @import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap");

  .elementModal {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: white;
    font-size: 13px;
    overflow-y: scroll;
    color: black;
    z-index: 200;
    pointer-events: all;
    box-sizing: border-box;
    margin-left: 6px;
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

  .elementModal::-webkit-scrollbar {
    width: 8px;
  }

  .elementModal::-webkit-scrollbar-thumb {
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
    width: 100%;
  }

  .attributes {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
    background: brown;
    border-radius: 5px;
    padding: 8px;
    width: 100%;
  }
</style>
