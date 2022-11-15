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
  style={styleString + "width: 100%; height: 100%; margin: 0px"}
  class="saeDiv"
>
  <slot />
  {content}
</div>

<style>
  .saeDiv {
    background: white;
    width: 100%;
    height: 100%;
    margin: 0px;
  }
</style>
