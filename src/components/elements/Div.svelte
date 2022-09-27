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

  /*
    let things = document.getElementsByClassName("thingDiv");

  const setChildOfAll = () => {
    Object.keys(things).forEach((key) => {
      if (things[key].id === "I7ELF8xQ6uFHR1DvZsKY") return;
      things[key].childOf = "I7ELF8xQ6uFHR1DvZsKY";
    });
  };

  const doRandomStuff = () => {
    Object.keys(things).forEach((key) => {
      if (things[key].id === "I7ELF8xQ6uFHR1DvZsKY") return;
      
      things[key].style.width = randomWidth(75, 100);
      things[key].style.height = randomHeight(50,50);
      
    });
  };

  createInterval(doRandomStuff, 500);
  */
</script>

{#key unique}
  <div in:fade {id} style={styleString} class={`thingDiv`}>
    {#each elements as element}
      <Element {element} />{/each}
    {content ? content : ""}
  </div>
{/key}

<style>
</style>
