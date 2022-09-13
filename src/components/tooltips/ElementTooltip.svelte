<script>
  import { fade } from "svelte/transition";

  import { okay } from "../../stores/settings";

  export let element;
  export let handleEdit;
  export let locked;
  export let handleMouseLeave;

  let top = null;
  let open = true;

  $: top = $okay ? "199px" : "273px";
</script>

<div
  on:click={(e) => {
    e.stopPropagation();
  }}
  on:mouseleave={() => {
    $: handleMouseLeave();
    open = false;
  }}
  transition:fade={{ duration: 50 }}
  class={locked ? "elementTooltip" : "elementTooltip unlocked"}
  style={`left: calc(100vw - 440px); top: ${top}`}
>
  {#if !locked && open}
    <div class="notLocked">Click Element to Edit</div>
  {/if}
  <div class="infoGroup">
    <label for="type" class="infoLabel">Element type</label>
    <input
      name="type"
      type="text"
      class="infoInput"
      disabled
      value={element.type}
    />
  </div>
  <div class="infoGroup">
    <label for="id" class="infoLabel">Element id</label>
    <input
      name="id"
      type="text"
      class="infoInput"
      disabled
      value={element.id}
    />
  </div>
  <div class="infoGroup">
    <label for="name" class="infoLabel">name</label>
    <input
      autocomplete="off"
      name="name"
      type="text"
      class="infoInput"
      value={element.name}
      on:input={(e) => {
        handleEdit("name", e.target.value);
      }}
    />
  </div>
  <div class="infoGroup">
    <label for="display" class="infoLabel">Display</label>
    <input
      autocomplete="off"
      name="display"
      type="text"
      class="infoInput"
      value={element.style.display}
      on:input={(e) => {
        handleEdit("display", e.target.value);
      }}
    />
  </div>
  <div class="infoGroup">
    <label for="width" class="infoLabel">Width</label>
    <input
      name="width"
      type="text"
      class="infoInput"
      value={element.style.width}
      on:input={(e) => handleEdit("width", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="height" class="infoLabel">Height</label>
    <input
      name="height"
      type="text"
      class="infoInput"
      value={element.style.height}
      on:input={(e) => handleEdit("height", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="background" class="infoLabel">Background</label>
    <input
      name="background"
      type="text"
      class="infoInput"
      value={element.style.background}
      on:input={(e) => handleEdit("background", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="border" class="infoLabel">Border</label>
    <input
      name="border"
      type="text"
      class="infoInput"
      value={element.style.border}
      on:input={(e) => handleEdit("border", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="margin" class="infoLabel">Margin</label>
    <input
      name="margin"
      type="text"
      class="infoInput"
      value={element.style.margin}
      on:input={(e) => handleEdit("margin", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="marginTop" class="infoLabel">Margin Top</label>
    <input
      name="marginTop"
      type="text"
      class="infoInput"
      value={element.style.marginTop}
      on:input={(e) => handleEdit("marginTop", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="marginBottom" class="infoLabel">Margin Bottom</label>
    <input
      name="marginBottom"
      type="text"
      class="infoInput"
      value={element.style.marginBottom}
      on:input={(e) => handleEdit("marginBottom", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="marginLeft" class="infoLabel">Margin Left</label>
    <input
      name="marginLeft"
      type="text"
      class="infoInput"
      value={element.style.marginLeft}
      on:input={(e) => handleEdit("marginLeft", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="marginRight" class="infoLabel">Margin Right</label>
    <input
      name="marginRight"
      type="text"
      class="infoInput"
      value={element.style.marginRight}
      on:input={(e) => handleEdit("marginRight", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="padding" class="infoLabel">Padding</label>
    <input
      name="padding"
      type="text"
      class="infoInput"
      value={element.style.padding}
      on:input={(e) => handleEdit("padding", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="paddingTop" class="infoLabel">Padding Top</label>
    <input
      name="paddingTop"
      type="text"
      class="infoInput"
      value={element.style.paddingTop}
      on:input={(e) => handleEdit("paddingTop", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="paddingBottom" class="infoLabel">Padding Bottom</label>
    <input
      name="paddingBottom"
      type="text"
      class="infoInput"
      value={element.style.paddingBottom}
      on:input={(e) => handleEdit("paddingBottom", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="paddingLeft" class="infoLabel">Padding Left</label>
    <input
      name="paddingLeft"
      type="text"
      class="infoInput"
      value={element.style.paddingLeft}
      on:input={(e) => handleEdit("paddingLeft", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="paddingRight" class="infoLabel">Padding Right</label>
    <input
      name="paddingRight"
      type="text"
      class="infoInput"
      value={element.style.paddingRight}
      on:input={(e) => handleEdit("paddingRight", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="borderRadius" class="infoLabel">Border radius</label>
    <input
      name="borderRadius"
      type="text"
      class="infoInput"
      value={element.style.borderRadius}
      on:input={(e) => handleEdit("borderRadius", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="boxShadow" class="infoLabel">Box shadow</label>
    <input
      name="boxShadow"
      type="text"
      class="infoInput"
      value={element.style.boxShadow}
      on:input={(e) => handleEdit("boxShadow", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="text" class="infoLabel">Content</label>
    <input
      name="text"
      type="text"
      class="infoInput"
      value={element.content}
      on:input={(e) => handleEdit("content", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="color" class="infoLabel">Color</label>
    <input
      name="color"
      type="text"
      class="infoInput"
      value={element.style.color}
      on:input={(e) => handleEdit("color", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="fontSize" class="infoLabel">Font size</label>
    <input
      name="fontSize"
      type="text"
      class="infoInput"
      value={element.style.fontSize}
      on:input={(e) => handleEdit("fontSize", e.target.value)}
    />
  </div>
</div>

<style>
  .elementTooltip {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: absolute;
    right: auto;
    width: fit-content;
    min-width: 400px;
    height: fit-content;
    background: white;
    border: 3px solid var(--oxford-blue);
    border-right: none;
    border-top: none;
    font-size: 13px;
    padding: 8px;
    overflow-y: auto;
    border-radius: 5px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    border-top-left-radius: 0px;
    z-index: 200;
  }

  .infoGroup {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
  }

  .infoGroup:hover {
    background: var(--shadow-blue);
  }

  .unlocked {
    opacity: 0.9;
  }

  .notLocked {
    font-weight: bold;
    font-size: 20px;
  }
</style>
