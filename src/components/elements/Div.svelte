<script>
  export let id;
  export let key;
  export let name;
  export let styleString;
  export let content;
</script>

<div {id} {key} {name} style={styleString} {content}>
  <slot />
  {content}
</div>

<style>
</style>
