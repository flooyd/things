<script>
  import { elements } from "../stores/elements";
  import { onMount } from "svelte";

  let tree = {};

  onMount(() => {
    //root
    makeTree($elements.find((e) => e.childOf === undefined)._id);
  });

  const makeTree = (parent) => {};
</script>

<div class="htmltree" />
