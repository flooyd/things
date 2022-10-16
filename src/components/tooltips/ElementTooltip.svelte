<script>
  import {
    loading,
    elementTooltipId,
    width,
    mousePosition,
    childPendingDeletion,
    parentOfChildPendingDeletion,
    showGrid,
    toolbarOpenStyle,
  } from "../../stores/globals";
  import { deleteElement } from "../../util";

  export let element;
  export let handleEdit;
  export let handleSave;

  let style =
    $mousePosition.x > $width / 2 ? "left: -3px" : "left: calc(100vw - 433px)";

  let infoGroups = [
    "gap",
    "justifyContent",
    "alignItems",
    "flexDirection",
    "flexWrap",
  ];
</script>

<div
  on:click={(e) => {
    e.stopPropagation();
  }}
  class="elementTooltip"
  style={style + $toolbarOpenStyle}
>
  <div class="toolbar">
    <button class="blueButton" on:click={() => handleSave()}>Save</button>
    <button
      on:click={() => ($showGrid = !$showGrid)}
      class="blueButton"
      type="button"
      >{#if $showGrid}Close{:else}Open{/if} Grid</button
    >
    <button
      type="button"
      on:click={async (e) => {
        e.stopPropagation();
        $elementTooltipId = null;
        await deleteElement(element._id);
        $childPendingDeletion = element._id;
        $parentOfChildPendingDeletion = element.childOf;
      }}
      disabled={$loading}
      class="redButton">Delete Element</button
    >
    <button
      class="blueButton"
      type="button"
      on:click={() => ($elementTooltipId = null)}
    >
      Close
    </button>
  </div>
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
      value={element.display}
      on:input={(e) => {
        handleEdit("display", e.target.value);
      }}
    />
  </div>
  <div class="infoGroup">
    <label for="width" class="infoLabel">Width</label>
    <input
      autocomplete="off"
      name="width"
      type="text"
      class="infoInput"
      value={element.width}
      on:input={(e) => handleEdit("width", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="height" class="infoLabel">Height</label>
    <input
      autocomplete="off"
      name="height"
      type="text"
      class="infoInput"
      value={element.height}
      on:input={(e) => handleEdit("height", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="background" class="infoLabel">Background</label>
    <input
      autocomplete="off"
      name="background"
      type="text"
      class="infoInput"
      value={element.background}
      on:input={(e) => handleEdit("background", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="border" class="infoLabel">Border</label>
    <input
      autocomplete="off"
      name="border"
      type="text"
      class="infoInput"
      value={element.border}
      on:input={(e) => handleEdit("border", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="margin" class="infoLabel">Margin</label>
    <input
      autocomplete="off"
      name="margin"
      type="text"
      class="infoInput"
      value={element.margin}
      on:input={(e) => handleEdit("margin", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="marginTop" class="infoLabel">Margin Top</label>
    <input
      autocomplete="off"
      name="marginTop"
      type="text"
      class="infoInput"
      value={element.marginTop}
      on:input={(e) => handleEdit("marginTop", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="marginBottom" class="infoLabel">Margin Bottom</label>
    <input
      autocomplete="off"
      name="marginBottom"
      type="text"
      class="infoInput"
      value={element.marginBottom}
      on:input={(e) => handleEdit("marginBottom", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="marginLeft" class="infoLabel">Margin Left</label>
    <input
      autocomplete="off"
      name="marginLeft"
      type="text"
      class="infoInput"
      value={element.marginLeft}
      on:input={(e) => handleEdit("marginLeft", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="marginRight" class="infoLabel">Margin Right</label>
    <input
      autocomplete="off"
      name="marginRight"
      type="text"
      class="infoInput"
      value={element.marginRight}
      on:input={(e) => handleEdit("marginRight", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="padding" class="infoLabel">Padding</label>
    <input
      autocomplete="off"
      name="padding"
      type="text"
      class="infoInput"
      value={element.padding}
      on:input={(e) => handleEdit("padding", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="paddingTop" class="infoLabel">Padding Top</label>
    <input
      autocomplete="off"
      name="paddingTop"
      type="text"
      class="infoInput"
      value={element.paddingTop}
      on:input={(e) => handleEdit("paddingTop", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="paddingBottom" class="infoLabel">Padding Bottom</label>
    <input
      autocomplete="off"
      name="paddingBottom"
      type="text"
      class="infoInput"
      value={element.paddingBottom}
      on:input={(e) => handleEdit("paddingBottom", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="paddingLeft" class="infoLabel">Padding Left</label>
    <input
      autocomplete="off"
      name="paddingLeft"
      type="text"
      class="infoInput"
      value={element.paddingLeft}
      on:input={(e) => handleEdit("paddingLeft", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="paddingRight" class="infoLabel">Padding Right</label>
    <input
      autocomplete="off"
      name="paddingRight"
      type="text"
      class="infoInput"
      value={element.paddingRight}
      on:input={(e) => handleEdit("paddingRight", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="borderRadius" class="infoLabel">Border radius</label>
    <input
      autocomplete="off"
      name="borderRadius"
      type="text"
      class="infoInput"
      value={element.borderRadius}
      on:input={(e) => handleEdit("borderRadius", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="boxShadow" class="infoLabel">Box shadow</label>
    <input
      autocomplete="off"
      name="boxShadow"
      type="text"
      class="infoInput"
      value={element.boxShadow}
      on:input={(e) => handleEdit("boxShadow", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="text" class="infoLabel">Content</label>
    <input
      autocomplete="off"
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
      autocomplete="off"
      name="color"
      type="text"
      class="infoInput"
      value={element.color}
      on:input={(e) => handleEdit("color", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="fontSize" class="infoLabel">Font size</label>
    <input
      autocomplete="off"
      name="fontSize"
      type="text"
      class="infoInput"
      value={element.fontSize}
      on:input={(e) => handleEdit("fontSize", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="childOf" class="infoLabel">Child Of</label>
    <input
      autocomplete="off"
      name="childOf"
      type="text"
      class="infoInput"
      value={element.childOf}
      on:input={(e) => handleEdit("childOf", e.target.value)}
    />
  </div>
  <div class="infoGroup">
    <label for="parentOf" class="infoLabel">Parent Of</label>
    <input
      name="parentOf"
      type="text"
      class="infoInput"
      value={element.parentOf}
      disabled
      on:input={(e) => handleEdit("parentOf", e.target.value)}
    />
  </div>
  {#each infoGroups as infoGroup, i}
    <div class={`infoGroup ${i === infoGroups.length - 1 ? " last" : ""}`}>
      <label for={infoGroup} class="infoLabel">{infoGroup}</label>
      <input
        autocomplete="off"
        name={infoGroup}
        type="text"
        class="infoInput"
        value={element[infoGroup]}
        on:input={(e) => handleEdit(infoGroup, e.target.value)}
      />
    </div>
  {/each}
  <div class="placeholder" />
</div>

<style>
  .elementTooltip {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 400px;
    max-width: 400px;
    background: white;
    font-size: 13px;
    padding: 0px 10px;
    overflow-y: auto;
    color: black;
    z-index: 200;
    pointer-events: all;
  }

  .toolbar {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: left;
    flex-wrap: wrap;
    margin-top: 20px;
  }

  .infoGroup {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
  }

  .last {
    color: red !important;
    margin-bottom: 20px;
  }

  .infoGroup:hover {
    background: var(--shadow-blue);
  }

  .message {
    height: 40px;
    border: 1px solid var(--oxford-blue);
    border-radius: 5px;
    padding: 8px;
  }
</style>
