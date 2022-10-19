<script lang="ts">
  import { onMount } from "svelte";
  import { fetchElements } from "../util.js";
  import { fade } from "svelte/transition";

  import { elements } from "../stores/elements";
  import { toolbarOpenStyle } from "../stores/globals";

  import Element from "./elements/Element.svelte";

  let ready = false;

  onMount(async () => {
    $elements = await getElements();
    ready = true;
  });

  const getElements = async () => {
    //fetches all elements from the database
    const fetchedElements = await fetchElements();

    //gets all children in the fetched elements
    const children = fetchedElements.filter(
      (e) => e.childOf !== null && e.childOf !== undefined
    );

    //for each element, find its children and add them to the parentOf property of the element
    const mappedElements = fetchedElements.map((e) => {
      const childrenIds = children
        .filter((c) => c.childOf === e._id)
        .map((c) => c._id);
      return {
        ...e,
        parentOf: [...childrenIds],
      };
    });

    return mappedElements;
  };
</script>

{#if ready}
  <div
    transition:fade={{ duration: 100 }}
    class="workbench"
    style={$toolbarOpenStyle}
  >
    <div class="view">
      {#each $elements as element (element._id)}
        {#if element.childOf?.length === 0 || !element.childOf}
          <Element {element} />
        {/if}
      {/each}
    </div>
  </div>
{/if}
{#if !ready}
  <div class="loading" in:fade>Loading...</div>
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

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh);
    font-size: 50px;
    background: var(--platinum);
    color: black;
  }
</style>
