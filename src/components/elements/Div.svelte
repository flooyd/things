<script>
  export let id;
  export let key;
  export let name;
  export let styleString;
</script>

<div {id} {key} {name} style={styleString}>
  <slot />
</div>

<style>
</style>
