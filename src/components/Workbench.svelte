<script lang="ts">
  import { onMount, tick } from "svelte";
  import { fetchElements } from "../util.js";
  import { fade } from "svelte/transition";

  import { elements } from "../stores/elements";
  import { fullscreen, showGrid, clickedElement } from "../stores/globals";

  import Element from "./elements/Element.svelte";

  let ready = false;

  onMount(async () => {
    $elements = await getElements();
    ready = true;
  });

  const getElements = async () => {
    //fetches all elements from the database
    const fetchedElements = await fetchElements();

    //gets children of each element by comparing the childOf property to the id
    //of each element
    const children = fetchedElements.filter(
      (e) => e.childOf !== null && e.childOf !== undefined
    );

    //adds the array of child ids to the parent element's parentOf property
    const mappedElements = fetchedElements.map((e) => {
      const childrenIds = children
        .filter((c) => c.childOf === e._id)
        .map((c) => c._id);
      console.log(childrenIds);
      return {
        ...e,
        parentOf: [...childrenIds],
      };
    });

    return mappedElements;
  };

  $: console.log($elements);
</script>

{#if ready}
  <div
    transition:fade={{ duration: 100 }}
    class="workbench"
    style="height: calc(100vh);"
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
    background: var(--cultured);
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
    height: calc(100vh - 127px);
    font-size: 50px;
    background: var(--platinum);
    color: black;
  }

  .collectionName {
    font-size: 31px;
    color: var(--oxford-blue);
    padding: 13px 20px;
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .toolbar {
    background: var(--shadow-blue);
    height: 31px;
    border-radius: 4px;
    border: 3px solid var(--oxford-blue);
    display: flex;
    align-items: center;
    justify-content: left;
    gap: 13px;
    padding: 10px 13px;
    margin: 0px 20px;
  }

  span {
    font-size: 13px;
  }
</style>
