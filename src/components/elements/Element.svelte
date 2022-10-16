<script>
  import { onMount } from "svelte";
  import { getId } from "../../util";
  import { fade } from "svelte/transition";
  import Div from "./Div.svelte";

  import { elementTooltipId, clickedElement } from "../../stores/globals";
  import { elements } from "../../stores/elements";

  export let element;

  let styleString,
    showTooltip,
    ready = null;

  const id = getId("div");

  onMount(() => {
    element.width = element.width ? element.width : "400px";
    element.height = element.height ? element.height : "300px";
    element.background = element.background ? element.background : "black";
    element.margin = element.margin ? element.margin : "0px auto";
    element.padding = element.padding ? element.padding : "0px";
    element.borderRadius = element.borderRadius ? element.borderRadius : "0px";
    element.border = element.border ? element.border : "";
    element.boxShadow = element.boxShadow ? element.boxShadow : "none";
    element.fontSize = element.fontSize ? element.fontSize : "16px";
    element.color = element.color ? element.color : "white";
    element.content = element.content ? element.content : "";
    element.id = element._id ? element._id : id;
    element.name = element.name ? element.name : "";
    element.marginBottom = element.marginBottom ? element.marginBottom : "";
    element.marginTop = element.marginTop ? element.marginTop : "";
    element.marginLeft = element.marginLeft ? element.marginLeft : "";
    element.marginRight = element.marginRight ? element.marginRight : "";
    element.paddingBottom = element.paddingBottom ? element.paddingBottom : "";
    element.paddingTop = element.paddingTop ? element.paddingTop : "";
    element.paddingLeft = element.paddingLeft ? element.paddingLeft : "";
    element.paddingRight = element.paddingRight ? element.paddingRight : "";
    element.display = element.display ? element.display : "block";
    element.gap = element.gap ? element.gap : "0px";
    element.justifyContent = element.justifyContent
      ? element.justifyContent
      : "flex-start";
    element.alignItems = element.alignItems ? element.alignItems : "flex-start";
    element.flexDirection = element.flexDirection
      ? element.flexDirection
      : "row";
    element.flexWrap = element.flexWrap ? element.flexWrap : "nowrap";
    element.position = element.position ? element.position : "";
    element.top = element.top ? element.top : "";
    element.right = element.right ? element.right : "";
    element.bottom = element.bottom ? element.bottom : "";
    element.left = element.left ? element.left : "";

    ready = true;
  });

  $: if ($clickedElement && $clickedElement.id === element.id) {
    element = $clickedElement;
  }

  $: if (ready) {
    console.log(element);
  }

  $: styleString = `width: ${element.width};
  height: ${element.height}; 
  background: ${element.background}; 
  border: ${element.border}; 
  margin: ${element.margin}; 
  margin-left: ${element.marginLeft};
  margin-right: ${element.marginRight};
  margin-bottom: ${element.marginBottom};
  margin-top: ${element.marginTop};
  padding: ${element.padding};
  padding-left: ${element.paddingLeft};
  padding-right: ${element.paddingRight};
  padding-bottom: ${element.paddingBottom};
  padding-top: ${element.paddingTop};
  border-radius: ${element.borderRadius};
  box-shadow: ${element.boxShadow};
  font-size: ${element.fontSize};
  color: ${element.color};
  display: ${element.display};
  gap: ${element.gap};
  justify-content: ${element.justifyContent};
  align-items: ${element.alignItems};
  flex-direction: ${element.flexDirection};
  flex-wrap: ${element.flexWrap};
  position: ${element.position};
  top: ${element.top};
  right: ${element.right};
  bottom: ${element.bottom};
  left: ${element.left};
  `;
</script>

{#if ready}
  <div
    class="element"
    out:fade
    on:click={(e) => {
      e.stopPropagation();
      showTooltip = true;
      $elementTooltipId = element.id;
      $clickedElement = element;
    }}
  >
    {#if element.type === "div"}
      <Div
        id={element.id}
        key={id}
        {styleString}
        content={element.content}
        parentOf={element.parentOf}
      />
    {/if}
  </div>
{/if}

<style>
  .element {
    height: fit-content;
    width: fit-content;
    cursor: pointer;
  }
</style>
