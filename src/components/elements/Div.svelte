<script>
  import { doc, getDoc, updateDoc } from "firebase/firestore";
  import { fly, fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { db, elementTooltipId } from "../../stores/globals";
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

  $: if ($elementTooltipId === key) {
    hoverBorder = "hoverBorder";
  } else {
    hoverBorder = "";
  }
</script>

{#key unique}
  <div in:fade {id} style={styleString} class={`${hoverBorder} thingDiv`}>
    {#each elements as element}
      <Element {element} />{/each}
    {content ? content : ""}
  </div>
{/key}

<style>
  .hoverBorder {
    background: white !important;
    color: black !important;
    box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75) !important;
  }
</style>
