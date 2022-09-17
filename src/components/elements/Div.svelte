<script>
  import { doc, getDoc, updateDoc } from "firebase/firestore";
  import { fly, fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { db } from "../../stores/globals";
  import Element from "./Element.svelte";
  export let styleString;
  export let content = "";
  export let id;
  export let parentOf;

  let elements = [];
  let ready = false;

  onMount(() => {
    if (parentOf) {
      parentOf.forEach(async (child, index, arr) => {
        const docRef = await doc($db, "things", child);
        const document = await getDoc(docRef);
        elements.push({ ...document.data(), id: document.id });
        elements = elements;
        if (index === arr.length - 1) {
          ready = true;
        }
      });
    }
  });
</script>

<div
  transition:fade={{
    x: Math.random() * 10000,
    y: Math.random() * 10000,
    duration: 300,
  }}
  {id}
  style={styleString}
>
  {#each elements as element}
    <Element {element} />{/each}
  {content}
</div>

<style>
</style>
