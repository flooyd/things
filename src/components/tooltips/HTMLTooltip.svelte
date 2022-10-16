<script>
  import { onMount } from "svelte";
  import { addElement } from "../../util";
  import { toolbarOpenStyle } from "../../stores/globals";
</script>

<div class="htmlTooltip" style={$toolbarOpenStyle}>
  <div class="header">
    <span>HTML</span>
    <i class="fa fa-html5" />
  </div>
  <div class="description">
    <span>HTML tags are used to create elements.</span>
    <span>Elements represent the structure of your app.</span>
    <span>Click on a tag to create an element and add it to the app.</span>
  </div>
</div>

<style>
  .htmlTooltip {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 400px;
    max-width: 400px;
    background: white;
    font-size: 13px;
    padding: 0px 10px;
    overflow-y: auto;
    color: black;
    z-index: 200;
    pointer-events: all;
    border-right: 3px solid lightgreen;
    border-top: 3px solid lightgreen;
  }

  .htmlTooltip::-webkit-scrollbar {
    width: 0px;
  }

  .header {
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 10px;
    font-weight: bold;
    display: flex;
    gap: 8px;
    color: lightgreen;
  }

  span {
    color: black;
  }

  .description {
    font-size: 13px;
    margin-bottom: 10px;
    line-height: 1.4;
  }
</style>
