<script>
  import { onMount, tick } from "svelte";
  import {
    variablesFetched,
    contextElement,
    childAssignmentPending,
    pendingChildDropBackground,
  } from "../../stores//globals";
  import { elements, elementsPendingUpdate } from "../../stores/elements";
  import { getId, updateElement } from "../../util";
  import Div from "./Div.svelte";

  import { elementTooltipId, clickedElement } from "../../stores/globals";

  export let element;

  let styleString,
    showTooltip,
    children = [],
    ctrlDown = false,
    ready = null;

  const id = getId("div");

  const getFunctionsToRun = (parentFunction) => {
    const connections = element.grid.connections.filter(
      (connection) => connection.out === parentFunction._id
    );

    const functionsToRun = connections.map((connection) => {
      return element.grid.functions.find((func) => func._id === connection.in);
    });

    return functionsToRun;
  };

  const consoleLog = (args) => {};

  const runFunction = (func) => {
    switch (func.name) {
    }

    const functionsToRun = getFunctionsToRun(func);
    if (functionsToRun.length > 0) {
      functionsToRun.forEach((func) => runFunction(func));
    }
  };

  //implement grid function onClick
  const handleClick = (e) => {
    if (!ctrlDown) {
      return;
    }
    if (!element.grid) return;
    const onClick = element.grid.functions.find(
      (func) => func.name === "onClick"
    );
    if (!onClick) return;
    const functionsToRun = getFunctionsToRun(onClick);
    functionsToRun.forEach((func) => runFunction(func));
  };

  onMount(() => {
    element.width = element.width ? element.width : "10px";
    element.height = element.height ? element.height : "10px";
    element.background = element.background ? element.background : "";
    element.margin = element.margin ? element.margin : "";
    element.padding = element.padding ? element.padding : "";
    element.borderRadius = element.borderRadius ? element.borderRadius : "";
    element.border = element.border ? element.border : "";
    element.boxShadow = element.boxShadow ? element.boxShadow : "";
    element.fontSize = element.fontSize ? element.fontSize : "";
    element.color = element.color ? element.color : "";
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
    element.display = element.display ? element.display : "";
    element.gap = element.gap ? element.gap : "";
    element.justifyContent = element.justifyContent
      ? element.justifyContent
      : "";
    element.alignItems = element.alignItems ? element.alignItems : "";
    element.flexDirection = element.flexDirection
      ? element.flexDirection
      : "row";
    element.flexWrap = element.flexWrap ? element.flexWrap : "";
    element.position = element.position ? element.position : "";
    element.top = element.top ? element.top : "";
    element.right = element.right ? element.right : "";
    element.bottom = element.bottom ? element.bottom : "";
    element.left = element.left ? element.left : "";
    ready = true;
  });

  $: if (element && $clickedElement?._id === element._id) {
    element = $clickedElement;
  }

  $: styleString = `width: ${element.width};
  height: ${element.height}; 
  background:${element.background || pendingChildDropBackground}; 
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

  const handleKeyDown = (e) => {
    if (e.key === "Control" && !ctrlDown) {
      ctrlDown = true;
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "Control") {
      ctrlDown = false;
    }
  };

  $: $contextElement && $contextElement._id === element._id
    ? (styleString = styleString + "border: 5px solid orange;")
    : (styleString =
        styleString +
        `background: ${element.background}; border: ${
          element.border || "none"
        };`);

  $: if (element.parentOf) {
    children = element.parentOf.map((childId) => {
      return $elements.find((element) => element._id === childId);
    });
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
{#if ready}
  <div
    class="element"
    on:dblclick={(e) => {
      if ($childAssignmentPending) return;
      e.stopPropagation();
      showTooltip = true;
      $elementTooltipId = element._id;
      $clickedElement = element;
      $variablesFetched = false;
    }}
    on:click={async (e) => {
      e.stopPropagation();
      if ($childAssignmentPending && $contextElement._id !== element._id) {
        const oldParent = $elements.find(
          (el) => el._id === $contextElement.childOf
        );
        if (oldParent) {
          oldParent.parentOf = oldParent.parentOf.filter(
            (child) => child !== $contextElement._id
          );
        }
        console.log("old parent");
        console.log("old prent", oldParent);
        $elements.find((el) => el._id === $contextElement._id).childOf =
          element._id;

        element.parentOf = [...element.parentOf, $contextElement._id];
        await updateElement($contextElement);
        $childAssignmentPending = null;
        $contextElement = null;
        $elements = $elements;
      }
      handleClick(e);
    }}
    on:keypress={(e) => {
      handleKeyDown(e);
    }}
    on:contextmenu={(e) => {
      e.preventDefault();
      e.stopPropagation();
      if ($contextElement?._id === element._id) {
        $contextElement = null;
      } else {
        $contextElement = element;
      }
      $childAssignmentPending = false;
    }}
    on:mouseover={async (e) => {
      e.stopPropagation();
      if ($childAssignmentPending && $contextElement._id !== element._id) {
        $pendingChildDropBackground = element._id;
      }
    }}
    on:focus
    on:mouseout={(e) => {
      $pendingChildDropBackground = null;
    }}
    on:blur
  >
    {#if element.type === "div"}
      <Div
        id={element._id}
        key={element._id}
        name={element.name || element._id}
        {styleString}
      >
        {#each children as child}
          <svelte:self element={child} />
        {/each}
      </Div>
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
