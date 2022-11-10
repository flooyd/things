<script>
  import {
    elements as elementsStore,
    elementUpdated,
  } from "../stores/elements";
  import { onMount } from "svelte";

  let tree = {};

  onMount(() => {
    const levelObject = {};

    $elementsStore.forEach((element) => {
      let level = 1;
      let parent = element.childOf;
      while (parent) {
        console.log(true);
        level++;
        parent = $elementsStore.find((e) => e._id === parent)?.childOf || null;
      }
      levelObject[element._id] = level;
    });

    $elementsStore.forEach((element) => {
      const level = levelObject[element._id];
      if (!tree[level]) {
        tree[level] = [];
      }
      tree[level].push(element.background);
    });

    console.log(tree);

    makeTree($elementsStore.find((e) => e.childOf === undefined)?._id);
  });

  const updateQuerySelector = () => {
    console.log(document.querySelectorAll(".saeDiv"));
    console.log(
      $elementsStore.map((e) => {
        return {
          id: e._id,
          childOf: e.childOf,
          parentOf: e.parentOf,
        };
      })
    );
  };

  $: $elementUpdated ? updateQuerySelector() : null;

  const makeTree = (parent) => {};
</script>

<div class="htmltree">
  {#each Object.entries(tree) as [level, elements]}
    <div class="level">
      <div class="level-number" style={`margin-left: ${8 * level}px;`}>
        <div class="elements">
          {#each elements as element}
            <div class="element">
              {element}
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .htmltree {
    border: 3px solid black;
    border-radius: 5px;
    padding: 8px;
    margin-bottom: 20px;
    margin-top: 20px;
  }
</style>
