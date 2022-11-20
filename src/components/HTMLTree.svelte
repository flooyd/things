<script>
  import {
    elements as elementsStore,
    elementUpdated,
    elementHoveredInDOMVisualizer,
    elementOpenedInDOM,
    DOMReadyToScroll,
  } from "../stores/elements";
  import {
    elementOnTheFrontBurner,
    toolbarOpenStyle,
    width,
  } from "../stores/globals";
  import ElementModal from "./modals/ElementModal.svelte";
  import { fly } from "svelte/transition";

  export let handleEdit;

  let tree = [];
  let thisElement = null;
  const levelObject = {};
  let mouseInModal = null;

  const updateMouseInModal = (id) => {
    mouseInModal = id;
  };

  const updateDOMTreeVisualizer = () => {
    $elementsStore.forEach((element) => {
      let level = 1;
      let parent = element.childOf;
      while (parent) {
        level++;
        parent = $elementsStore.find((e) => e._id === parent)?.childOf || null;
      }
      levelObject[element._id] = level;
    });

    tree = [];

    let saeDivs = document.querySelectorAll(".saeDiv");

    Object.keys(saeDivs).forEach((key) => {
      let saeDiv = saeDivs[key];
      let level = levelObject[saeDiv.id];
      tree.push({
        level,
        saeDiv: $elementsStore.find((e) => e._id === saeDiv.id),
      });
    });
  };

  const scrollToY = async (element) => {
    thisElement.scrollTop = 0;
    let topOffset = $toolbarOpenStyle.length > 0 ? 49 : 0;
    thisElement.scrollTop =
      document.getElementById(`saeDiv-${element}`).getBoundingClientRect().top -
      topOffset;
  };
  $: $elementUpdated ? updateDOMTreeVisualizer() : null;
  $: $DOMReadyToScroll && $elementOpenedInDOM && thisElement
    ? scrollToY($elementOpenedInDOM)
    : null;
</script>

<div
  in:fly={{ y: -500, duration: 100 }}
  class="htmltree"
  style={$toolbarOpenStyle.length > 0
    ? $toolbarOpenStyle + "top: -49px;"
    : "top: 0px;"}
  bind:this={thisElement}
  on:scroll={(e) => {}}
>
  <div class="placeholder" />
  {#each tree as { level, saeDiv }, index (saeDiv._id)}
    <div
      id="saeDiv-{saeDiv._id}"
      class="line"
      style={mouseInModal === saeDiv._id ||
      $elementHoveredInDOMVisualizer === saeDiv._id
        ? "position: sticky; top: 0px"
        : ""}
      on:mouseenter={() => {
        $elementHoveredInDOMVisualizer = saeDiv._id;
      }}
      on:mouseleave={() => {
        $elementHoveredInDOMVisualizer = null;
      }}
      on:click={() => {
        $elementOnTheFrontBurner = saeDiv;
        $elementOpenedInDOM =
          saeDiv._id === $elementOpenedInDOM ? null : saeDiv._id;
      }}
    >
      <span class="lineNumber">{index + 1}</span>
      <div style={`margin-left: ${level * 8}px`}>
        &lt;div style="background: "{saeDiv.background}"... id="{saeDiv._id}"
        ... /&gt;
      </div>
    </div>
    {#if $elementOpenedInDOM === saeDiv._id}
      <ElementModal
        element={saeDiv}
        {handleEdit}
        fromTree={true}
        mouseInModal={updateMouseInModal}
      />
    {/if}
  {/each}
</div>

<style>
  .htmltree {
    border-left: 3px solid black;
    padding-left: 0px;
    width: 550px;
    margin-left: auto;
    position: absolute;
    box-sizing: border-box;
    height: calc(100vh);
    right: 0px;
    z-index: 9999;
    overflow-y: auto;
    padding-bottom: 20px;
    background: white;
    opacity: 1;
  }

  .line {
    display: flex;
    align-items: center;
    z-index: 9999;
    background: white;
    background: #f0f0f0;
    padding: 8px;
    word-wrap: break-word;
    background: #f0f0f0;
    margin-bottom: 3px;
    font-size: 13px;
  }

  .line:hover {
    background: brown;
    cursor: pointer;
  }

  .lineNumber {
    color: grey;
  }

  .placeholder {
    height: 20px;
    width: 100%;
    z-index: 9999;
    position: sticky;
    top: 0px;
  }
</style>
