<script>
  import { storesTooltipOpen } from "../stores/globals";
</script>

<div on:click={() => ($storesTooltipOpen = !$storesTooltipOpen)} class="item">
  <span><i class="" /></span>
  <span>stores</span>
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
</style>
