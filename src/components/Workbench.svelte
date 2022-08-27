<script>
  import WorkbenchElements from "./WorkbenchElements.svelte";
</script>

<div class="workbench">
  <div class="toolbar">
    <WorkbenchElements />
  </div>
</div>

<style>
  .workbench {
    background: var(--cultured);
    padding: 20px;
    margin: 0px 0px;
    color: black;
    height: calc(100vh - 200px);
  }

  .toolbar {
    background: var(--shadow-blue);
    height: 31px;
    border-radius: 4px;
    border: 3px solid var(--oxford-blue);
    display: flex;
    align-items: center;
    justify-content: left;
    gap: 13px;
    padding: 10px 13px;
  }
</style>
