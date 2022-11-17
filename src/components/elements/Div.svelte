<script>
  export let id;
  export let key;
  export let name;
  export let styleString;
  export let content;

  let className = "saeDiv";
</script>

<div
  {id}
  {key}
  {name}
  style={styleString +
    "width: 100%; height: 100%; margin: 0px; padding: 0px; border: none; background: none;"}
  class="saeDiv"
>
  <slot />
  {content}
</div>

<style>
  .saeDiv {
    width: 100%;
    height: 100%;
    margin: 0px;
  }
</style>
