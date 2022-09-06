<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { okay } from "../stores/settings";

  let mounted = false;

  onMount(() => {
    mounted = true;
  });
</script>

{#if mounted && !$okay}
  <div in:fade={{ duration: 50 }} out:fade={{ duration: 50 }} class="intro">
    <div>
      Create highly interactive, customizable, animated controls, forms, tables,
      and more things.
    </div>
    <div class="okay">
      <button on:click={() => ($okay = true)}>Okay</button>
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
