<script>
  import { contextElement, childAssignmentPending } from "../stores/globals";
  import { elements } from "../stores/elements";
</script>

<div class="contextMenu" style={$childAssignmentPending ? "opacity: .25" : ""}>
  <button
    class="brownButton"
    on:click={() => ($childAssignmentPending = !$childAssignmentPending)}
  >
    {#if $childAssignmentPending}
      Cancel
    {:else}
      Assign as Child
    {/if}
  </button>
  <button
    class="brownButton"
    on:click={() => {
      $elements.find((el) => el._id === $contextElement._id).childOf = null;
    }}>Remove as Child</button
  >
  <button class="redButton">Delete</button>
</div>

<style>
  .contextMenu {
    padding: 8px;
    width: 400px;
    height: 400px;
    color: black;
    position: absolute;
    top: calc((100vh - 400px) / 2);
    left: calc((100vw - 400px) / 2);
    background: white;
    opacity: 0.9;
    border: 3px solid black;
  }
</style>
