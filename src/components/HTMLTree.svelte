<script>
  import {
    elements as elementsStore,
    elementUpdated,
    elementHoveredInDOMVisualizer,
    openedInDOM,
    DOMScrollToOnOpen,
  } from "../stores/elements";
  import { clickedElement, toolbarOpenStyle, width } from "../stores/globals";
  import ElementTooltip from "./tooltips/ElementTooltip.svelte";
  import { fly } from "svelte/transition";

  export let handleEdit;

  let tree = [];
  let thisElement = null;
  const levelObject = {};
  let mouseInTooltip = null;
  let clientHeight = 0;

  const updateMouseInTooltip = (id) => {
    mouseInTooltip = id;
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
  $: $DOMScrollToOnOpen && thisElement ? scrollToY($DOMScrollToOnOpen) : null;
</script>

<div
  in:fly={{ x: $width + 500, duration: 100 }}
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
      style={mouseInTooltip === saeDiv._id ||
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
        $clickedElement = saeDiv;
        $openedInDOM = saeDiv._id === $openedInDOM ? null : saeDiv._id;
      }}
    >
      <span class="lineNumber">{index + 1}</span>
      <div style={`margin-left: ${level * 8}px`}>
        &lt;div style="background: "{saeDiv.background}"... id="{saeDiv._id}"
        ... /&gt;
      </div>
    </div>
    {#if $openedInDOM === saeDiv._id}
      <ElementTooltip
        element={saeDiv}
        {handleEdit}
        fromTree={true}
        mouseInTooltip={updateMouseInTooltip}
      />
    {/if}
  {/each}
</div>

<style>
  .htmltree {
    border-left: 3px solid black;
    padding-left: 0px;
    width: fit-content;
    margin-left: auto;
    position: absolute;
    box-sizing: border-box;
    height: calc(100vh);
    right: 0px;
    z-index: 9999;
    overflow-y: auto;
    padding-bottom: 20px;
    background: white;
  }

  .line {
    display: flex;
    align-items: center;
    z-index: 9999;
    background: white;
    background: #f0f0f0;
    padding-bottom: 8px;
    padding-top: 8px;
    padding-left: 8px;
    background: #f0f0f0;
    margin-bottom: 3px;
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
