<script>
  import { onMount, afterUpdate } from "svelte";
  import { elementUpdated } from "../../stores/elements";

  export let id;
  export let key;
  export let name;
  export let styleString;
  export let content;

  afterUpdate(() => {
    $elementUpdated++;
    console.log($elementUpdated);
  });
</script>

<div {id} {key} {name} style={styleString} class="saeDiv">
  <slot />
  {content}
</div>

<style>
</style>
