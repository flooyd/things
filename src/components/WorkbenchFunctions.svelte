<script>
  import { storesTooltipOpen, functionsTooltipOpen } from "../stores/globals";
</script>

<div
  on:click={() => ($functionsTooltipOpen = !$functionsTooltipOpen)}
  class="item"
>
  <span><i class="" /></span>
  <span>functions</span>
</div>

<style>
  .item {
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    padding: 5px 2px;
    border: 3px solid var(--oxford-blue);
    cursor: pointer;
    background: var(--cultured);
    max-height: 30px;
    width: 125px;
  }

  .item:hover {
    background: var(--rich-black-fogra-29);
    color: var(--cultured);
  }
</style>
