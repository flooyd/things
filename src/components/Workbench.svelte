<script lang="ts">
  import {
    addDoc,
    collection,
    getDocs,
    getFirestore,
  } from "firebase/firestore";
  import { element } from "svelte/internal";

  import { elements } from "../stores/elements";
  import {
    width,
    height,
    client,
    db,
    awaitingFirebase,
    global,
  } from "../stores/globals";

  import Element from "./elements/Element.svelte";
  import WorkbenchElements from "./WorkbenchElements.svelte";
  import WorkbenchStores from "./WorkbenchStores.svelte";
  import WorkbenchFunctions from "./WorkbenchFunctions.svelte";

  let collectionName = "Sample Collection";
  let heightOffset = 167;
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
  $: $global.current === "b" ? console.log($global.b) : null;
</script>

{#if ready}
  <div class="workbench" style="height: calc(100vh - {heightOffset}px);">
    <div
      on:click={() => {
        $global.b = 3;
      }}
      class="collectionName"
    >
      <h1>{collectionName}</h1>
    </div>
    <div class="toolbar">
      <WorkbenchElements />
      <WorkbenchStores />
      <WorkbenchFunctions />
    </div>
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
    padding: 20px;
    margin: 0px 0px;
    color: black;
  }

  .collectionName {
    font-size: 31px;
    margin-bottom: 13px;
    color: var(--oxford-blue);
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
  }

  .view {
    margin: 0px -20px;
    margin-top: 20px;
    height: calc(100% - 101px);
    overflow-y: auto;
  }
</style>
