<script>
  import { onMount } from "svelte";
  import { getId } from "./util";

  import ElementTooltip from "../tooltips/ElementTooltip.svelte";
  import Div from "./Div.svelte";

  import { elementTooltipId } from "../../stores/globals";

  export let element;

  let styleString,
    showTooltip,
    elementClicked = null;

  const id = getId().replace("undefined-", "");

  onMount(() => {
    element.style.width = "300px";
    element.style.height = "100px";
    element.style.background = "var(--platinum)";
    element.style.margin = "0px auto";
    element.style.padding = "0px";
    element.style.borderRadius = "0px";
    element.style.border = "3px solid var(--oxford-blue)";
    element.style.boxShadow = "5px 8px 5px 1px var(--oxford-blue)";
    element.style.fontSize = "16px";
    element.style.color = "black";
    element.content = "";
    element.id = id;
    element.name = "blah";
    element.style.marginBottom = "0px";
    element.style.marginTop = "0px";
    element.style.marginLeft = "0px";
    element.style.marginRight = "0px";
    element.style.paddingBottom = "0px";
    element.style.paddingTop = "0px";
    element.style.paddingLeft = "0px";
    element.style.paddingRight = "0px";
    element.style.display = "block";
  });

  const handleEdit = (property, value) => {
    if (property === "content") {
      return (element.content = value);
    }
    if (property === "name") {
      return (element.name = value);
    }

    element.style[property] = value;
  };

  $: styleString = `width: ${element.style.width}; 
  height: ${element.style.height}; 
  background: ${element.style.background}; 
  border: ${element.style.border}; 
  margin: ${element.style.margin}; 
  margin-left: ${element.style.marginLeft};
  margin-right: ${element.style.marginRight};
  margin-bottom: ${element.style.marginBottom};
  margin-top: ${element.style.marginTop};
  padding: ${element.style.padding};
  padding-left: ${element.style.paddingLeft};
  padding-right: ${element.style.paddingRight};
  padding-bottom: ${element.style.paddingBottom};
  padding-top: ${element.style.paddingTop};
  border-radius: ${element.style.borderRadius};
  box-shadow: ${element.style.boxShadow};
  font-size: ${element.style.fontSize};
  color: ${element.style.color};
  display: ${element.style.display};
  `;
</script>

{#if styleString}
  <div
    class="element"
    style="width: ${element.style.width}; height: ${element.style.height};"
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
      <Div {id} {styleString} content={element.content} name={element.name} />
    {/if}
    {#if (showTooltip && $elementTooltipId === id) || (elementClicked && $elementTooltipId === id)}
      <ElementTooltip
        {element}
        {handleEdit}
        handleMouseLeave={() => {
          elementClicked = false;
        }}
        locked={elementClicked}
      />
    {/if}
  </div>
{/if}

<style>
  .element {
    height: fit-content;
  }
</style>
