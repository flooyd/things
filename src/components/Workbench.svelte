<script lang="ts">
  import { afterUpdate, onMount } from "svelte";
  import { fetchElements } from "../util.js";

  import {
    elements,
    elementsPendingUpdate,
    elementUpdated,
  } from "../stores/elements";
  import { toolbarOpenStyle } from "../stores/globals";

  import Element from "./elements/Element.svelte";
  import { fade } from "svelte/transition";
  import HtmlTree from "./HTMLTree.svelte";

  let ready = false;

  onMount(async () => {
    $elements = $elements ? $elements : await getElements();
    console.log($elements);
    ready = true;
  });

  const getElements = async () => {
    //fetches all elements from the database
    const fetchedElements = await fetchElements();
    console.log("fetchedElements", fetchedElements);
    return fetchedElements;

    // //gets all children in the fetched elements
    // const children = fetchedElements.filter(
    //   (e) => e.childOf !== null && e.childOf !== undefined
    // );

    // //for each element, find its children and add them to the parentOf property of the element
    // const mappedElements = fetchedElements.map((e) => {
    //   const childrenIds = children
    //     .filter((c) => c.childOf === e._id)
    //     .map((c) => c._id);
    //   return {
    //     ...e,
    //     parentOf: [...childrenIds],
    //   };
    // });
    // return mappedElements;
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
    <div class="view">
      {#if $elementUpdated}
        <HtmlTree />
      {/if}
      {#each $elements as element (element._id)}
        {#if !element.childOf}
          <Element {element} />
        {/if}
      {/each}
    </div>
  </div>
{/if}

<style>
  .workbench {
    margin: 0px 0px;
    color: black;
    overflow-y: auto;
    overflow-x: auto;
  }

  .view {
    background: white;
    height: 100%;
    width: 100%;
  }
</style>
