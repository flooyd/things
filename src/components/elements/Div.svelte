<script>
  import { doc, getDoc, updateDoc } from "firebase/firestore";
  import { fly, fade } from "svelte/transition";
  import { onMount } from "svelte";
  import {
    db,
    elementTooltipId,
    parentOfChildPendingDeletion,
    childPendingDeletion,
  } from "../../stores/globals";
  import { elements as elementsStore } from "../../stores/elements";
  import Element from "./Element.svelte";
  import { element } from "svelte/internal";

  export let styleString;
  export let content = "";
  export let id;
  export let parentOf;
  export let key;

  let elements = [];
  let unique = {};
  let hoverBorder = "3px solid red";

  onMount(() => {
    if (parentOf.length > 0) {
      parentOf.forEach(async (child, index, arr) => {
        //child is the id of the child element. get the element from the store and add it to the elements array
        const childElement = $elementsStore.find(
          (element) => element._id === child
        );
        elements = [...elements, childElement];
      });
    }
  });

  $: if ($parentOfChildPendingDeletion === id) {
    elements = elements.filter((e) => e.id !== $childPendingDeletion);
    $childPendingDeletion = null;
    $parentOfChildPendingDeletion = null;
  }

  $: if ($elementTooltipId === key) {
    hoverBorder = "hoverBorder";
  } else {
    hoverBorder = "";
  }
</script>

{#key unique}
  <div transition:fade {id} style={styleString} class={`thingDiv`}>
    {#each elements as element (element.id)}
      <Element {element} />
    {/each}
    {content}
  </div>
{/key}

<style>
  div {
    color: black;
  }
</style>
