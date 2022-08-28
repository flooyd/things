<script>
  import { slide } from "svelte/transition";
  import tab from "../stores/tab";

  const tabs = ["Collection", "Workbench"];
  $tab = "Workbench";
</script>

<div class="toolbar">
  {#each tabs as tabItem}
    <div
      class="tab {$tab === tabItem ? 'active' : 'inactive'}"
      on:click={() => ($tab = tabItem)}
    >
      {tabItem}
    </div>
  {/each}
</div>

<style>
  .toolbar {
    font-size: 25px;
    color: var(--shadow-blue);
    background: var(--rich-black-fogra-29);
    padding-top: 10px;
    margin-bottom: 10px;
    margin-left: 20px;
    font-weight: bold;
    display: flex;
    gap: 13px;
  }

  .tab {
    height: fit-content;
    border-top: 4px solid var(--rich-black-fogra-29);
    border-bottom: 4px solid var(--rich-black-fogra-29);
    padding-bottom: 4px;
  }

  .tab:hover {
    cursor: pointer;
    color: var(--cultured);
  }

  .active {
    border-bottom: 3px solid var(--cultured);
    border-radius: 0px;
    color: var(--cultured);
  }
</style>
