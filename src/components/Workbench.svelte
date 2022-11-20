<script lang="ts">
  import { onMount } from "svelte";
  import { fetchElements } from "../util.js";

  import {
    elements,
    elementsPendingUpdate,
    visualizeDOM,
  } from "../stores/elements";
  import {
    toolbarOpenStyle,
    showGrid,
    componentOnTheFrontBurner,
  } from "../stores/globals";

  import Element from "./elements/Element.svelte";
  import { fade } from "svelte/transition";
  import HtmlTree from "./HTMLTree.svelte";

  export let handleEdit;

  let ready = false;

  onMount(async () => {
    $elements = $elements ? $elements : await getElements();
    // $showGrid = true;
    // $componentOnTheFrontBurner = { componentName: "Thing" };
    ready = true;
  });

  const getElements = async () => {
    const fetchedElements = await fetchElements();
    return fetchedElements;
  };

  const updateElements = async () => {
    $elements = await getElements();
  };

  $: if ($elementsPendingUpdate) {
    updateElements();
  }
</script>

{#if ready}
  <div
    transition:fade={{ duration: 100 }}
    class="workbench"
    style={$toolbarOpenStyle}
  >
    {#if $visualizeDOM}
      <HtmlTree {handleEdit} />
    {/if}
    {#each $elements as element (element._id)}
      {#if !element.childOf}
        <Element {element} />
      {/if}
    {/each}
  </div>
{/if}

<style>
  .workbench {
    margin: 0px 0px;
    color: black;
    overflow-y: auto;
    overflow-x: auto;
  }
</style>
