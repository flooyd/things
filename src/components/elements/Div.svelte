<script>
  import { onMount } from "svelte";
  import {
    db,
    elementTooltipId,
    parentOfChildPendingDeletion,
    childPendingDeletion,
  } from "../../stores/globals";
  import {
    elements as elementsStore,
    elementsPendingUpdate,
  } from "../../stores/elements";
  import Element from "./Element.svelte";
  import { element } from "svelte/internal";

  export let styleString;
  export let content = "";
  export let id;
  export let parentOf;
  export let key;
  export let name;

  let elements = [];
  let unique = {};
  let hoverBorder = "3px solid red";

  onMount(() => {
    getChildElements();
  });

  const getChildElements = () => {
    if (parentOf.length > 0) {
      parentOf.forEach(async (child, index, arr) => {
        //child is the id of the child element. get the element from the store and add it to the elements array
        const childElement = $elementsStore.find(
          (element) => element._id === child
        )._id;
        elements = [...elements, childElement];
      });
    }
  };

  $: if ($parentOfChildPendingDeletion === id) {
    elements = elements.filter((e) => e.id !== $childPendingDeletion);
    $childPendingDeletion = null;
    $parentOfChildPendingDeletion = null;
  }

  console.log("hi fromd div", id);
</script>

<div {id} style={styleString} class={`thingDiv`} {name}>
  {#each $elementsStore as element (element._id)}
    {#if elements.includes(element._id)}
      <Element {element} />
    {/if}
  {/each}
  {content}
</div>

<style>
  div {
    color: black;
    opacity: 1 !important;
  }
</style>
