<script>
  import { onMount } from "svelte";
  import { getId } from "../../util";
  import { doc, getDoc, updateDoc } from "firebase/firestore";

  import ElementTooltip from "../tooltips/ElementTooltip.svelte";
  import Div from "./Div.svelte";

  import {
    elementTooltipId,
    db,
    altDown,
    mouseInTooltip,
  } from "../../stores/globals";
  import { elements } from "../../stores/elements";

  export let element;

  let styleString,
    showTooltip,
    elementClicked,
    docRef,
    ready = null;

  const id = getId("div");

  onMount(() => {
    docRef = doc($db, "things", element.id);

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
    element.id = element.id ? element.id : id;
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
    element.parentOf = $elements
      .filter((e) => e.childOf === element.id)
      .map((e) => e.id);

    ready = true;
  });

  const handleEdit = (property, value) => {
    element[property] = value;
    docRef ? updateDoc(docRef, element) : null;
  };

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
  `;
</script>

{#if ready}
  <div
    class="element"
    style="width: ${element.width}; height: ${element.height};"
    on:mouseover={(e) => {
      e.stopPropagation();
      if (!$altDown && !$mouseInTooltip) {
        showTooltip = true;
        $elementTooltipId = id;
      }
    }}
    on:focus={(e) => {
      e.stopPropagation();
      if (!$altDown && !$mouseInTooltip) {
        showTooltip = true;
        $elementTooltipId = id;
      }
    }}
    on:mouseout={(e) => {
      e.stopPropagation();
      if (!$altDown && !$mouseInTooltip) {
        showTooltip = false;
        $elementTooltipId = null;
      }
    }}
    on:blur={(e) => {
      e.stopPropagation();
      if (!$altDown && !$mouseInTooltip) {
        showTooltip = false;
        $elementTooltipId = null;
      }
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

  {#if showTooltip && $elementTooltipId === id}
    <ElementTooltip {element} {handleEdit} />
  {/if}
{/if}

<style>
  .element {
    height: fit-content;
    width: fit-content;
    cursor: pointer;
  }
</style>
