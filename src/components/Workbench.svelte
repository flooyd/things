<script lang="ts">
  import { collection, getDocs, getFirestore } from "firebase/firestore";
  import { typewriter } from "../util.js";
  import { fly } from "svelte/transition";

  import { elements } from "../stores/elements";
  import {
    width,
    height,
    db,
    global,
    hideUI,
    fullscreen,
  } from "../stores/globals";

  import Element from "./elements/Element.svelte";
  import WorkbenchElements from "./WorkbenchElements.svelte";
  import WorkbenchStores from "./WorkbenchStores.svelte";
  import WorkbenchFunctions from "./WorkbenchFunctions.svelte";

  let collectionName = "Sample Collection";
  let heightOffset = 127;
  $: $fullscreen ? (heightOffset = 0) : (heightOffset = 127);

  let ready = false;

  const fetchElements = async () => {
    const thingsCollection = await collection($db, "things");
    const querySnapshot = await getDocs(thingsCollection);
    $elements = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });

    //for each element, set parentOf = [] if it doesn't exist
    $elements.forEach((element) => {
      if (!element.parentOf) {
        element.parentOf = [];
      }
      const childElements = $elements.filter((child) => {
        return child.childOf === element.id;
      });

      childElements.forEach((child) => {
        element.parentOf = [...element.parentOf, child.id];
      });
    });
    $elements = $elements;
    ready = true;
  };

  fetchElements();
</script>

{#if ready}
  <div class="workbench" style="height: calc(100vh - {heightOffset}px);">
    {#if !$hideUI}
      <div transition:fly={{ x: 0, y: -227 }}>
        <div class="collectionName">
          <h1>
            {collectionName}
          </h1>
          <span in:typewriter={{ speed: 5 }}>{"F1 to hide/show"}</span>
        </div>
        <div class="toolbar">
          <WorkbenchElements />
          <WorkbenchStores />
          <WorkbenchFunctions />
        </div>
      </div>
    {/if}
    <div class="view" bind:clientHeight={$height} bind:clientWidth={$width}>
      {#each $elements as element (element.id)}
        {#if element.childOf?.length === 0 || !element.childOf}
          <Element {element} />
        {/if}
      {/each}
    </div>
  </div>
{/if}

<style>
  .workbench {
    background: var(--cultured);
    margin: 0px 0px;
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
