<script>
  import { getId } from "./util";
  export let styleString;
  export let content;

  let id = getId();
</script>

<div id style={styleString}>
  {content}
</div>

<style>
</style>
