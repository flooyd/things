<script>
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";

  let mounted = false;

  onMount(() => {
    mounted = true;
  });
</script>

{#if mounted}
  <div in:fly={{ delay: 1750, duration: 250, y: -75 }} class="intro">
    <div>
      Create highly interactive, customizable, animated, and responsive
      components, controls, forms, tables, and more.
    </div>
    <div class="okay">
      <button>Okay</button>
    </div>
  </div>
{/if}

<style>
  .intro {
    background: var(--cultured);
    color: black;
    font-size: 16px;
    padding: 8px 20px;
    max-width: fit-content;
    margin-left: 20px;
  }

  .okay {
    text-align: right;
    margin-top: 13px;
  }
</style>
