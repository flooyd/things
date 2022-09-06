<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import ElementTooltip from "../tooltips/ElementTooltip.svelte";

  import Div from "./Div.svelte";

  export let element;
  let x,
    y,
    height,
    width,
    styleString,
    showTooltip = null;

  onMount(() => {
    element.style.width = "100px";
    element.style.height = "100px";
    element.style.background = "var(--platinum)";
    element.style.margin = "0px";
    element.style.padding = "0px";
    element.style.borderRadius = "0px";
    element.style.border = "3px solid var(--oxford-blue)";
    element.style.boxShadow = "5px 8px 5px 1px var(--oxford-blue)";
    element.style.fontSize = "16px";
    element.style.content = "";
    element.style.color = "black";
  });
  const handleEdit = (property, value) => {
    if (property === "content") {
      return (element.content = value);
    }
    element.style[property] = value;
    element = element;
  };

  $: styleString = `width: ${element.style.width}; 
  height: ${element.style.height}; 
  background: ${element.style.background}; 
  border: ${element.style.border}; 
  margin: ${element.style.margin}; 
  padding: ${element.style.padding};
  border-radius: ${element.style.borderRadius};
  box-shadow: ${element.style.boxShadow};
  font-size: ${element.style.fontSize};
  color: ${element.style.color};
  `;
  $: console.log(x, y);
  $: console.log(element.style);
</script>

{#if styleString}
  <div
    class="element"
    bind:offsetHeight={y}
    bind:offsetWidth={x}
    bind:clientHeight={height}
    bind:clientWidth={width}
    on:mouseenter={() => {
      showTooltip = true;
    }}
    on:mouseleave={() => {
      showTooltip = false;
    }}
  >
    {#if element.type === "div"}
      <Div {styleString} content={element.content} />
    {/if}
    {#if showTooltip}
      <ElementTooltip {element} {handleEdit} />
    {/if}
  </div>
{/if}

<style>
  .element {
    position: relative;
    height: fit-content;
  }
</style>
