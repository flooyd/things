<script lang="ts">
  import { collection, getDocs, getFirestore } from "firebase/firestore";
  import { typewriter, fetchElements } from "../util.js";
  import { fly, fade } from "svelte/transition";

  import { elements } from "../stores/elements";
  import { db, global, hideUI, fullscreen } from "../stores/globals";

  import Element from "./elements/Element.svelte";
  import WorkbenchElements from "./WorkbenchElements.svelte";
  import WorkbenchStores from "./WorkbenchStores.svelte";
  import WorkbenchFunctions from "./WorkbenchFunctions.svelte";

  let collectionName = "Sample Collection";
  let heightOffset = 127;
  $: $fullscreen ? (heightOffset = 0) : (heightOffset = 127);

  let ready = false;

  const getElements = async () => {
    console.log("getting elements");
    const fetchedElements = await fetchElements();

    fetchedElements.forEach((element) => {
      if (!element.parentOf) {
        element.parentOf = [];
      }
      const childElements = fetchedElements.filter((child) => {
        return child.childOf === element.id;
      });

      childElements.forEach((child) => {
        element.parentOf = [...element.parentOf, child.id];
      });
    });

    console.log("processing elements done");

    $elements = fetchedElements;
    ready = true;
  };

  getElements();
</script>

{#if ready}
  <div
    transition:fade={{ duration: 100 }}
    class="workbench"
    style="height: calc(100vh - {heightOffset}px);"
  >
    {#if !$hideUI}
      <div transition:fade={{ duration: 100 }}>
        <div class="collectionName">
          <h1>
            {collectionName}
          </h1>
          <span>{"F1 to hide/show"}</span>
        </div>
        <div class="toolbar">
          <WorkbenchElements />
          <WorkbenchStores />
          <WorkbenchFunctions />
        </div>
      </div>
    {/if}
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
  }

  .view {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 127px);
    font-size: 50px;
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
