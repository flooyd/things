<script>
  import { onMount } from "svelte";
  import { getId } from "./util";

  import ElementTooltip from "../tooltips/ElementTooltip.svelte";
  import Div from "./Div.svelte";

  import { elementTooltipId } from "../../stores/globals";

  export let element;

  let styleString,
    showTooltip,
    elementClicked,
    thisElement = null;

  const id = getId().replace("undefined-", "");

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
    element.style.color = "black";

    element.content = "";
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
</script>

{#if styleString}
  <div
    bind:this={thisElement}
    class="element"
    on:mouseenter={() => {
      showTooltip = true;
      $elementTooltipId = id;
    }}
    on:mouseleave={() => {
      showTooltip = false;
    }}
    on:click={(e) => {
      elementClicked = !elementClicked;
    }}
  >
    {#if element.type === "div"}
      <Div {id} {styleString} content={element.content} />
    {/if}
    {#if (showTooltip && $elementTooltipId === id) || (elementClicked && $elementTooltipId === id)}
      <ElementTooltip {element} {handleEdit} locked={elementClicked} />
    {/if}
  </div>
{/if}

<style>
  .element {
    height: fit-content;
  }
</style>
