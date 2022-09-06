<script>
  import { fade } from "svelte/transition";

  import { okay } from "../../stores/settings";

  export let element;
  export let handleEdit;
  export let locked;

  let top = null;

  $: top = $okay ? "199px" : "273px";
</script>

<div
  on:click={(e) => {
    e.stopPropagation();
  }}
  transition:fade={{ duration: 50 }}
  class={locked ? "elementTooltip" : "elementTooltip unlocked"}
  style={`left: calc(100vw - 440px); top: ${top}`}
>
  {#if !locked}
    <div class="notLocked">Click Element to Lock</div>
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
