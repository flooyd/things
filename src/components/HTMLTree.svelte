<script>
  import { elements } from "../stores/elements";
  import { onMount } from "svelte";

  let tree = {};

  onMount(() => {
    //each element has childOf and parentOf properties
    //if childOf is empty, it is a root element
    //example dom tree
    // div - level 0
    //   div - level 1
    //     div - level 2
    //     div - level 2
    //   div - level 1
    //     div - level 2
    //     div - level 2
    //      div - level 3
    // div

    makeTree($elements.find((e) => e.childOf === undefined)._id);
  });

  const makeTree = (parent) => {};
</script>

<div class="htmltree" />
