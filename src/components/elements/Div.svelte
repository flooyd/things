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
  import Element from "./Element.svelte";

  export let styleString;
  export let content = "";
  export let id;
  export let parentOf;
  export let key;

  let elements = [];
  let unique = {};
  let hoverBorder = "3px solid red";

  onMount(() => {
    if (parentOf) {
      parentOf.forEach(async (child, index, arr) => {
        const docRef = await doc($db, "things", child);
        const document = await getDoc(docRef);
        elements.push({ ...document.data(), id: document.id });
        elements = elements;
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
      <Element {element} />{/each}
    {content ? content : ""}
  </div>
{/key}

<style>
</style>
