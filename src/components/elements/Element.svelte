<script>
  import Div from "./Div.svelte";

  export let element;
</script>

<div class="element">
  {#if element.type === "div"}
    <Div />
  {/if}
</div>
